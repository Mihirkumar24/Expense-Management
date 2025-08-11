import express from 'express';

import {
    isAdmin,
    isAuthenticated
} from '../middlewares/authorization.js';

import {
    createBudget,
    getAllBudgets
} from '../controllers/budgetController.js';

const router = new express.Router();

router.route('/budgets')
    .all(isAuthenticated, isAdmin)
    .get(getAllBudgets)
    .post(createBudget);

export default router;