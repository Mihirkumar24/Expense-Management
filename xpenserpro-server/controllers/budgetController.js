import _ from 'lodash';

import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import Budget from '../models/Budget.js';

export const createBudget = asyncErrorHandler(async (req, res, next) => {
    const {
        account,
        amount,
        currency,
        currencyExchangeRate,
        date,
        department,
        expenseCategory,
        organizationId
    } = req.body;

    const convertedAmount = _.round(amount * currencyExchangeRate);

    const newBudget = {
        account,
        amount,
        convertedAmount,
        currency,
        currencyExchangeRate,
        date,
        department,
        expenseCategory,
        organization: organizationId
    }

    const budget = await Budget.create(newBudget);

    res.json({ budget });
});

export const getAllBudgets = asyncErrorHandler(async (req, res, next) => {
    const {
        organizationId
    } = req.query;

    const filter = {
        organization: organizationId
    };

    const budgets = await Budget
        .find(filter)
        .populate(['account', 'department']);

    res.json({ budgets });
});