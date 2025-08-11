import express from 'express';

import { isAuthenticated } from '../middlewares/authorization.js';

import {
    createAccount,
    getAllAccounts
} from '../controllers/accountController.js';

const router = new express.Router();

router.route('/administrator/accounts')
    .all(isAuthenticated)
    .get(getAllAccounts)
    .post(createAccount);

export default router;