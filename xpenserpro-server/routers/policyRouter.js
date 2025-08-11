import express from 'express';

import { isAdmin, isAuthenticated } from '../middlewares/authorization.js';

import {
    createPolicy,
    getAllPolicies,
    getPolicy,
    updatePolicy
} from '../controllers/policyController.js';

const router = new express.Router();

router.route('/administrator/settings/policies')
    .all(isAuthenticated, isAdmin)
    .post(createPolicy);

router.route('/administrator/settings/policies/:policyId')
    .all(isAuthenticated, isAdmin)
    .get(getPolicy)
    .post(updatePolicy);

router.route('/policies')
    .all(isAuthenticated)
    .get(getAllPolicies);

export default router;
