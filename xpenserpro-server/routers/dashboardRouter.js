import express from 'express';

import { isAuthenticated } from '../middlewares/authorization.js';

import { getDashboardData } from '../controllers/dashboardController.js';

const router = new express.Router();

router.route('/dashboard').get(isAuthenticated, getDashboardData);

export default router;