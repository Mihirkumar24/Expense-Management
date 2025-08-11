import express from 'express';

import { isAuthenticated } from '../middlewares/authorization.js';

import {
    createAccountPayable,
    getAllAccountsPayable
} from '../controllers/accountsPayableController.js';

const router = new express.Router();

router.route('/accounts-payable')
    .all(isAuthenticated)
    .get(getAllAccountsPayable)
    .post(createAccountPayable);

export default router;