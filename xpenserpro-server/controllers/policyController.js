import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import Policy from '../models/Policy.js';

export const createPolicy = asyncErrorHandler(async (req, res, next) => {
    const { organizationId } = req.query;

    const {
        expenseCategories,
        description,
        name
    } = req.body;

    const newPolicy = {
        description,
        expenseCategories,
        name,
        organization: organizationId
    };

    const policy = await Policy.create(newPolicy);

    res.json({ policy });
});

export const getAllPolicies = asyncErrorHandler(async (req, res, next) => {
    const { organizationId } = req.query;

    const filter = {
        organization: organizationId
    };

    const policies = await Policy.find(filter);

    res.json({ policies });
});

export const getPolicy = asyncErrorHandler(async (req, res, next) => {
    const { policyId } = req.params;

    const policy = await Policy.findById(policyId);

    res.json({ policy });
});

export const updatePolicy = asyncErrorHandler(async (req, res, next) => {
    const { policyId } = req.params;

    const {
        expenseCategories,
        description,
        name
    } = req.body;

    const policyUpdate = {
        description,
        expenseCategories,
        name
    };

    const policy = await Policy.findByIdAndUpdate(
        policyId,
        policyUpdate
    );

    res.json({ policy });
});