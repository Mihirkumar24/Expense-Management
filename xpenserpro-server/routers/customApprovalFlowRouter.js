import express from 'express';

import {
    isAdmin,
    isAuthenticated
} from '../middlewares/authorization.js';

import {
    createCustomApprovalFlow,
    getAllCustomApprovalFlows,
    getCustomApprovalFlow,
    updateCustomApprovalFlow
} from '../controllers/customApprovalFlowController.js';

const router = express.Router();

router.route('/administrator/custom-approval-flows')
    .get(isAuthenticated, isAdmin, getAllCustomApprovalFlows)
    .post(isAuthenticated, isAdmin, createCustomApprovalFlow);

router.route('/administrator/custom-approval-flows/:customApprovalFlowId')
    .get(isAuthenticated, isAdmin, getCustomApprovalFlow)
    .post(isAuthenticated, isAdmin, updateCustomApprovalFlow);

export default router;