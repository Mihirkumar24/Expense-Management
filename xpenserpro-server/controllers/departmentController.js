import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

import Department from '../models/Department.js';

export const createDepartment = asyncErrorHandler(async (req, res, next) => {
    const {
        head,
        name,
        organizationId
    } = req.body;

    const newDepartment = {
        head,
        name,
        organization: organizationId
    };

    const department = await Department.create(newDepartment);

    res.json({
        department
    });
});

export const getAllDepartments = asyncErrorHandler(async (req, res, next) => {
    const {
        organizationId
    } = req.query;

    const filter = {
        organization: organizationId
    };

    const departments = await Department.find(filter).populate('head');

    res.json({
        departments
    });
});