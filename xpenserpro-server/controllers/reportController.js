import mongoose from 'mongoose';
import _ from 'lodash';

import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import CustomError from '../utils/CustomError.js';
import {
    approveAndForwardReportMailTemplate,
    approveReportMailTemplate,
    rejectReportMailTemplate,
    submitReportMailTemplate
} from '../utils/mailTemplates.js';
import sendMail from '../utils/sendMail.js';

import Department from '../models/Department.js';
import Expense from '../models/Expense.js';
import Project from '../models/Project.js';
import Report from '../models/Report.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Advance from '../models/Advance.js';

export const createReport = asyncErrorHandler(async (req, res, next) => {
    const submitterId = req.userId;

    const {
        businessPurpose,
        date,
        name,
    } = req.body;

    const newReport = {
        businessPurpose,
        date,
        name,
        submitter: submitterId,
    };

    const report = await Report.create(newReport);

    res.json({ report });
});

export const getAllReports = asyncErrorHandler(async (req, res, next) => {
    const { role, status } = req.query;

    const userId = req.userId;

    let filter;

    if (role === 'submitter') {
        filter = { submitter: userId }
    } else if (role === 'approver') {
        filter = { approver: userId }
    }

    if (status !== 'all') {
        filter = { ...filter, status }
    }

    const reports = await Report
        .find(filter)
        .populate('approver');

    res.json({ reports });
});

export const getReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const report = await Report.findById(reportId)
        .populate([
            'advances',
            'approvalFlow',
            'approver',
            'submitter',
            'expenses'
        ]);

    res.json({ report });
});

export const addExpensesToReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    let { expenseIds } = req.body;

    expenseIds = expenseIds.map(
        (expenseId) => mongoose.Types.ObjectId.createFromHexString(expenseId)
    );

    const aggregate = await Expense.aggregate([
        {
            $match: {
                '_id': {
                    $in: expenseIds
                }
            }
        },
        {
            $group: {
                '_id': null,
                totalAmount: {
                    $sum: '$amount'
                }
            }
        }
    ]);

    await Expense.updateMany(
        {
            '_id': {
                $in: expenseIds
            }
        },
        {
            status: 'reported'
        }
    );

    const report = await Report.findById(reportId);

    report.amount = _.round(report.amount + _.round(aggregate[0].totalAmount, 2), 2);

    report.reimbursable_amount = _.round(report.reimbursable_amount + _.round(aggregate[0].totalAmount, 2), 2);

    expenseIds.forEach((expenseId) => {
        report.expenses.push(expenseId)
    });

    await report.save();

    res.json({ report });
});

export const removeExpenseFromReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const { expenseId } = req.body;

    const report = await Report.findById(reportId);

    const expense = await Expense.findById(expenseId);

    report.amount = _.round(report.amount - expense.convertedAmount, 2);

    report.expenses.pull(expenseId);

    expense.status = 'unreported';

    await report.save();

    await expense.save();

    res.json({ report });
});

function evaluate(value, comparator, criterionValue) {
    switch (comparator) {
        case 'lessThan':
            return value < criterionValue;
        case 'lessThanEqualTo':
            return value <= criterionValue;
        case 'equalTo':
            return value === criterionValue;
        case 'greaterThanEqualTo':
            return value >= criterionValue;
        case 'greaterThan':
            return value > criterionValue;
    }
}

export const submitReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const report = await Report
        .findById(reportId)
        .populate('submitter')
        .populate('expenses');

    const submitterId = report.submitter.id;

    const submitter = await User
        .findById(submitterId)
        .populate({
            path: 'organization',
            populate: {
                path: 'setting',
                populate: {
                    path: 'customApprovalFlows'
                }
            }
        });

    const customApprovalFlows = submitter.organization.setting.customApprovalFlows;

    let approvalFlowType = 'hierarchy';
    let customApprovalFlowApprovers;

    for (const customApprovalFlow of customApprovalFlows) {
        const {
            approvers,
            criteria,
            criteriaPattern,
            name
        } = customApprovalFlow;

        const criteriaResult = [];

        for (const criterion of criteria) {
            const {
                comparator,
                field,
                value
            } = criterion;

            let result = false;

            if (field === 'amount') {
                result = evaluate(report.amount, comparator, value);
            }

            if (field === 'department') {
                result = evaluate(report.department, comparator, value);
            }

            if (field === 'expenseCategory') {
                for (const expense of report.expenses) {
                    result ||= evaluate(expense.category, comparator, value);
                }
            }

            if (field === 'project') {
                result = evaluate(report.project, comparator, value);
            }

            if (field === 'team') {
                result = evaluate(report.team, comparator, value);
            }

            criteriaResult.push(result);
        }

        const replacedCriteriaPattern = criteriaPattern
            .replace(/\d+/g, match => criteriaResult[match - 1])
            .replace(/\bAND\b/g, '&&')
            .replace(/\bOR\b/g, '||');

        if (eval(replacedCriteriaPattern)) {
            approvalFlowType = 'custom';

            customApprovalFlowApprovers = approvers;

            break;
        }
    }

    const approvalFlow = [];

    if (approvalFlowType === 'custom') {
        for (const customApprovalFlowApprover of customApprovalFlowApprovers) {
            const {
                type,
                subType
            } = customApprovalFlowApprover;

            if (type === 'departmentHead') {
                const departmentId = subType;
                const department = await Department.findById(departmentId);

                const approver = department.head;

                approvalFlow.push(approver);
            }

            if (type === 'departmentHeadOfTheCreator') {
                if (!submitter.department) {
                    throw new CustomError('You must be part of a department to submit this report.', 401);
                }

                const approver = submitter.department.head;

                approvalFlow.push(approver);
            }

            if (type === 'hierarchy') {
                let level = Number(subType);

                if (!submitter.approver) {
                    throw new CustomError('You must have an approver to submit a report.', 401);
                }

                let currentApproverId = submitter.approver;

                while (level--) {
                    approvalFlow.push(currentApproverId);

                    const currentApprover = await User.findById(currentApproverId);

                    if (!currentApprover.approver) {
                        throw new CustomError(
                            `${currentApprover.firstName} ${currentApprover.lastName} doesn\'t have an approver.`,
                            401
                        );
                    }

                    const nextApproverId = currentApprover.approver;

                    currentApproverId = nextApproverId;
                }
            }

            if (type === 'manual') {
                const approverId = subType;
                const approver = await User.findById(approverId);

                approvalFlow.push(approver);
            }

            if (type === 'projectHead') {
                const projectId = subType;
                const project = await Project.findById(projectId);

                const approverId = project.head;
                const approver = await User.findById(approverId);

                approvalFlow.push(approver);
            }

            if (type === 'teamHead') {
                const teamId = subType;
                const team = await Team.findById(teamId);

                const approverId = team.head;
                const approver = await User.findById(approverId);

                approvalFlow.push(approver);
            }

            if (type === 'teamHeadOfTheCreator') {
                if (!submitter.team) {
                    throw new CustomError('You must be part of a team to submit this report.', 401);
                }

                const approverId = submitter.team.head;
                const approver = await User.findById(approverId);

                approvalFlow.push(approver);
            }
        }
    } else {
        let level = Number(submitter.level);

        if (!submitter.approver) {
            throw new CustomError('You must have an approver to submit a report.', 401);
        }

        let currentApproverId = submitter.approver;

        while (level--) {
            approvalFlow.push(currentApproverId);

            const currentApprover = await User.findById(currentApproverId);

            if (!currentApprover.approver) {
                throw new CustomError(
                    `${currentApprover.firstName} ${currentApprover.lastName} doesn\'t have an approver.`,
                    401
                );
            }

            const nextApproverId = currentApprover.approver;

            currentApproverId = nextApproverId;
        }
    }

    await report.updateOne({
        approvalFlow,
        approvalFlowType,
        approver: approvalFlow[0],
        status: 'submitted'
    });

    const approver = await User.findById(approvalFlow[0]);

    const html = submitReportMailTemplate(
        report._id,
        report.name,
        `${report.submitter.firstName} ${report.submitter.lastName}`
    );

    await sendMail(
        approver.email,
        'New Expense Report Submitted',
        html
    );

    res.json({
        message: 'Report is submitted.'
    });
});

export const approveReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const report = await Report
        .findById(reportId)
        .populate('approver')
        .populate('submitter');

    if (report.approvalFlowLevel === report.approvalFlow.length - 1) {
        const html = approveReportMailTemplate(report._id, report.name);

        await sendMail(
            report.submitter.email,
            'Expense Report Approved',
            html
        );

        await Expense.updateMany(
            {
                '_id': {
                    $in: report.expenses
                }
            },
            {
                status: 'approved'
            }
        );

        report.status = 'approved';
        report.approvalFlowLevel += 1;

        await report.save();
    } else {
        const html = approveAndForwardReportMailTemplate(
            `${report.approver.firstName} ${report.approver.lastName}`,
            report._id,
            report.name,
            `${report.submitter.firstName} ${report.submitter.lastName}`
        );

        const approver = await User.findById(report.approvalFlow[report.approvalFlowLevel + 1]);

        await sendMail(
            approver.email,
            'Expense Report Approved',
            html
        );

        await report.updateOne({
            approver: report.approvalFlow[report.approvalFlowLevel + 1],
            $inc: {
                'approvalFlowLevel': 1
            }
        });
    }

    res.json({ message: 'Approved.' });
});

export const rejectReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const { reason } = req.body;

    const report = await Report
        .findById(reportId)
        .populate('approver')
        .populate('submitter');

    const html = rejectReportMailTemplate(
        `${report.approver.firstName} ${report.approver.lastName}`,
        report._id,
        report.name
    );

    await sendMail(
        report.submitter.email,
        'Expense Report Rejected',
        html
    );

    await Expense.updateMany(
        {
            '_id': {
                $in: report.expenses
            }
        },
        {
            $unset: {
                approver: ''
            },
            status: 'rejected'
        }
    );

    report.rejectReason = reason;
    report.status = 'rejected';

    await report.save();

    res.json({ message: 'Rejected' });
});

export const addCommentToReport = asyncErrorHandler(async (req, res, next) => {
    const commentatorId = req.userId;
    const commentator = await User
        .findById(commentatorId)
        .select('firstName lastName');

    const { reportId } = req.params;

    const { comment } = req.body;

    const newComment = {
        comment,
        commentator
    };

    await Report.findByIdAndUpdate(
        reportId,
        {
            $addToSet: {
                comments: newComment
            }
        }
    );

    res.json({ comment: newComment });
});

export const delegateReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const { delegate } = req.body;

    const report = await Report.findById(reportId);

    report.approvalFlow[report.approvalFlowLevel] = delegate;

    report.approver = delegate;

    await report.save();

    res.json({ delegate });
});

export const applyAdvanceToReport = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const { advanceId } = req.body;

    const report = await Report.findById(reportId);

    const advance = await Advance.findById(advanceId);

    const advanceAmount = _.round(report.advanceAmount + advance.amount, 2);

    const reimbursableAmount = _.round(report.reimbursableAmount - advance.amount, 2);

    advance.report = reportId;
    advance.reportStatus = 'applied';

    await advance.save();

    report.advanceAmount = advanceAmount;
    report.advances.push(advanceId);
    report.reimbursableAmount = reimbursableAmount;

    await report.save();

    res.json({ message: 'Success' });
});