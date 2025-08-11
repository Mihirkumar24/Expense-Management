import _ from 'lodash';
import mongoose from 'mongoose';

import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

import Advance from '../models/Advance.js';
import Budget from '../models/Budget.js';
import User from '../models/User.js';

import createApprovalFlow from '../utils/createApprovalFlow.js';

export const createAdvance = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    const {
        account,
        amount,
        businessPurpose,
        currency,
        currencyExchangeRate,
        date,
        expenseCategory,
        description,
        referenceNumber
    } = req.body;

    const convertedAmount = _.round(amount * currencyExchangeRate, 2);

    const user = await User
        .findById(userId)
        .populate('policy');

    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    const startOfNextMonth = new Date(startOfCurrentMonth);
    startOfNextMonth.setMonth(startOfNextMonth.getMonth() + 1);

    const aggregate = await Advance.aggregate([
        {
            $match: {
                date: {
                    $gte: startOfCurrentMonth,
                    $lt: startOfNextMonth
                },
                expenseCategory: expenseCategory,
                submitter: mongoose.Types.ObjectId.createFromHexString(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$convertedAmount' }
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);

    if (user.policy) {
        const policy = user.policy;

        const { expenseCategoryLimit } = policy.expenseCategories.find(
            (policyExpenseCategory) => policyExpenseCategory.expenseCategory === expenseCategory
        );

        if (expenseCategoryLimit !== -1
            && ((convertedAmount > expenseCategoryLimit)
                || (aggregate[0] && (aggregate[0].totalAmount + convertedAmount > expenseCategoryLimit)))
        ) {
            throw new CustomError(
                'Requested advance exceeds the limit set by your organization.',
                400
            );
        }
    }

    if (user.department) {
        const department = user.department;

        const budgetFilter = {
            account,
            currency,
            'date.from': { $lte: new Date(date) },
            'date.to': { $gte: new Date(date) },
            department,
            expenseCategory,
            organization: user.organization
        };

        const budget = await Budget.findOne(budgetFilter);

        if (budget && convertedAmount > budget.convertedAmount) {
            throw new CustomError(
                'Requested advance exceeds the budget set by your organization.',
                400
            );
        }
    }

    const {
        approvalFlow,
        approvalFlowType
    } = await createApprovalFlow('advance', userId);

    const newAdvance = {
        account,
        amount,
        approvalFlow,
        approvalFlowType,
        approver: approvalFlow[0],
        businessPurpose,
        convertedAmount,
        currency,
        currencyExchangeRate,
        date,
        expenseCategory,
        referenceNumber,
        submitter: userId
    };

    if (description) {
        newAdvance.description = description;
    }

    const advance = await Advance.create(newAdvance);

    res.json({ advance });
});

export const getAdvance = asyncErrorHandler(async (req, res, next) => {
    const { advanceId } = req.params;

    const advance = await Advance
        .findById(advanceId)
        .populate('account');

    res.json({ advance });
});

export const getAllAdvancesOfTheAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    const {
        role,
        status
    } = req.query;

    let filter;

    if (role === 'submitter') {
        filter = { submitter: userId };
    }

    if (role === 'approver') {
        filter = { approver: userId };
    }

    if (status && status !== 'all') {
        filter.status = status;
    }

    const advances = await Advance
        .find(filter)
        .populate('account report submitter');

    res.json({ advances });
});

export const approveAdvance = asyncErrorHandler(async (req, res, next) => {
    const { advanceId } = req.params;

    const advance = await Advance.findById(advanceId);

    if (advance.approvalFlowLevel === advance.approvalFlow.length - 1) {
        advance.status = 'approved';
        advance.approvalFlowLevel += 1;

        await advance.save();
    } else {
        advance.approver = advance.approvalFlow[advance.approvalFlowLevel + 1];
        advance.approvalFlowLevel += 1;

        await advance.save();
    }

    res.json({ message: 'Approved.' });
});

export const rejectAdvance = asyncErrorHandler(async (req, res, next) => {
    const { reportId } = req.params;

    const { reason } = req.body;

    const advance = await Advance
        .findById(reportId)
        .populate('approver');

    advance.reason = reason;
    advance.status = 'rejected';

    await advance.save();

    res.json({ message: 'Rejected' });
});