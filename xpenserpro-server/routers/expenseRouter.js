import express from 'express';

import { isAuthenticated } from '../middlewares/authorization.js';

import {
    createExpense,
    deleteExpense,
    getAllExpenses,
    getExpense
} from '../controllers/expenseController.js';

const router = new express.Router();

router.route('/expenses')
    .get(isAuthenticated, getAllExpenses)
    .post(isAuthenticated, createExpense);

router.route('/expenses/:expenseId')
    .delete(isAuthenticated, deleteExpense)
    .get(isAuthenticated, getExpense);

export default router;