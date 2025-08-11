import CustomError from './CustomError.js';

import Department from '../models/Department.js';
import Project from '../models/Project.js';
import Team from '../models/Team.js';
import User from '../models/User.js';

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

export default async function createApprovalFlow(module, submitterId) {
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

    const customApprovalFlows = submitter
        .organization
        .setting
        .customApprovalFlows
        .find(customApprovalFlow => customApprovalFlow.module === module)
        ?? [];

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

        approvalFlow.push(currentApproverId);

        --level;

        while (level--) {
            const currentApprover = await User.findById(currentApproverId);

            if (!currentApprover.approver) {
                throw new CustomError(
                    `${currentApprover.firstName} ${currentApprover.lastName} doesn\'t have an approver.`,
                    401
                );
            }

            const nextApproverId = currentApprover.approver;

            approvalFlow.push(currentApproverId);

            currentApproverId = nextApproverId;
        }
    }

    return {
        approvalFlow,
        approvalFlowType
    }
}