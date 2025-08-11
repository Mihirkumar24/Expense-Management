import express from 'express';

import { isAuthenticated } from '../middlewares/authorization.js';

import {
    approveAdvance,
    createAdvance,
    getAdvance,
    getAllAdvancesOfTheAuthenticatedUser,
    rejectAdvance
} from '../controllers/advanceController.js';

const router = new express.Router();

router.route('/advances')
    .all(isAuthenticated)
    .get(getAllAdvancesOfTheAuthenticatedUser)
    .post(createAdvance);

router.route('/advances/:advanceId')
    .all(isAuthenticated)
    .get(getAdvance);

router.route('/advances/:advanceId/approve').post(isAuthenticated, approveAdvance);
router.route('/advances/:advanceId/reject').post(isAuthenticated, rejectAdvance);

export default router;