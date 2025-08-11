import express from 'express';

import { isAuthenticated } from '../middlewares/authorization.js';

import {
    addCommentToReport,
    addExpensesToReport,
    applyAdvanceToReport,
    approveReport,
    createReport,
    delegateReport,
    getReport,
    getAllReports,
    removeExpenseFromReport,
    rejectReport,
    submitReport
} from '../controllers/reportController.js';

const router = express.Router();

router.route('/reports')
    .get(isAuthenticated, getAllReports)
    .post(isAuthenticated, createReport);

router.route('/reports/:reportId').get(isAuthenticated, getReport);

router.route('/reports/:reportId/comment').post(isAuthenticated, addCommentToReport);

router.route('/reports/:reportId/delegate').post(isAuthenticated, delegateReport);

router.route('/reports/:reportId/add-expenses').post(isAuthenticated, addExpensesToReport);
router.route('/reports/:reportId/remove-expense').post(isAuthenticated, removeExpenseFromReport);

router.route('/reports/:reportId/approve').post(isAuthenticated, approveReport);
router.route('/reports/:reportId/reject').post(isAuthenticated, rejectReport);
router.route('/reports/:reportId/submit').post(isAuthenticated, submitReport);

router.route('/reports/:reportId/apply-advance-to-report').post(isAuthenticated, applyAdvanceToReport);

export default router;