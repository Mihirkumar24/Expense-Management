import express from 'express';

import {
    isAuthenticated,
    isAdmin
} from '../middlewares/authorization.js';

import {
    getSetting,
    updateSetting
} from '../controllers/settingController.js';

const router = express.Router();

router.route('/setting').get(getSetting);

router.route('/setting/:settingId')
    .patch(isAuthenticated, isAdmin, updateSetting);

export default router;