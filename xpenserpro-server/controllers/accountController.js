import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import Account from '../models/Account.js';

export const createAccount = asyncErrorHandler(async (req, res, next) => {
    const { organizationId } = req.query;

    const {
        code,
        description,
        name,
        type
    } = req.body;

    const newAccount = {
        code,
        description,
        name,
        organization: organizationId,
        type
    }

    if (req.body.accountNumber) {
        newAccount.accountNumber = req.body.accountNumber;
    }

    const account = await Account.create(newAccount);

    res.json({ account });
});

export const getAllAccounts = asyncErrorHandler(async (req, res, next) => {
    const { organizationId } = req.query;

    const filter = {
        organization: organizationId
    }

    const accounts = await Account.find(filter);

    res.json({ accounts });
});