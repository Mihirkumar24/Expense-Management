import express from 'express';

import {
    isAuthenticated,
    isAdmin
} from '../middlewares/authorization.js';

import {
    createDepartment,
    getAllDepartments
} from '../controllers/departmentController.js';

const router = new express.Router();

router.route('/departments')
    .all(isAuthenticated, isAdmin)
    .get(getAllDepartments)
    .post(createDepartment);

export default router;