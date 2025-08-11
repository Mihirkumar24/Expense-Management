import mongoose from 'mongoose';

import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import Advance from '../models/Advance.js';
import Expense from '../models/Expense.js';
import Report from '../models/Report.js';
import User from '../models/User.js';

export const getDashboardData = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    const user = await User.findById(userId);

    const unreportedAdvancesAggregate = await Advance.aggregate([
        {
            $match: {
                status: 'approved',
                reportStatus: 'notApplied',
                submitter: mongoose.Types.ObjectId.createFromHexString(userId)
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$convertedAmount' }
            }
        },
        {
            $project: {
                _id: 0,
                total: 1
            }
        }
    ]);

    const unreportedAdvances = unreportedAdvancesAggregate[0]?.total ?? 0;

    const unreportedExpensesCount = await Expense.countDocuments({
        status: 'unreported',
        submitter: userId
    });

    const advancesPendingApprovalCount = await Advance.countDocuments({
        status: 'submitted',
        approver: user.approver
    });

    const reportsPendingApprovalCount = await Report.countDocuments({
        status: 'submitted',
        approver: user.approver
    });

    const pendingApprovalsCount = advancesPendingApprovalCount + reportsPendingApprovalCount;

    const reportsAwaitingApproval = await Report
        .find({
            status: 'submitted',
            submitter: userId
        })
        .populate('approver');

    const reportsAwaitingReimbursement = await Report
        .find({
            status: 'approved',
            submitter: userId
        })
        .populate('approver');

    const unsubmittedReports = await Report
        .find({
            status: 'draft',
            submitter: userId
        })
        .populate('approver');

    res.json({
        reportsAwaitingApproval,
        reportsAwaitingReimbursement,
        pendingApprovalsCount,
        unreportedAdvances,
        unreportedExpensesCount,
        unsubmittedReports
    });
});