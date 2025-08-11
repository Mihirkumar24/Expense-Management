import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import AccountPayable from '../models/AccountPayable.js';

export const createAccountPayable = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    const {
        transactionDate,
        transactionType,
        invoiceDate,
        company,
        mainAccount,
        description,
        debit,
        credit,
        offsetAccount,
        methodOfPayment,
        termsOfPayment,
        dueDate,
        exchangeRate,
        organizationId
    } = req.body;

    const newAccountsPayable = {
        creator: userId,
        transactionDate,
        transactionType,
        invoiceDate,
        company,
        mainAccount,
        description,
        debit,
        credit,
        offsetAccount,
        methodOfPayment,
        termsOfPayment,
        dueDate,
        exchangeRate,
        organization: organizationId
    };

    const accountsPayable = await AccountPayable.create(newAccountsPayable);

    res.json({ accountsPayable });
});

export const getAllAccountsPayable = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    const {
        organizationId
    } = req.query;

    const filter = {
        creator: userId,
        organization: organizationId
    };

    const accountsPayable = await AccountPayable.find(filter);

    res.json({ accountsPayable });
});