import express from 'express';

import {
    isAuthenticated,
    isAdmin
} from '../middlewares/authorization.js';

import {
    createTeam,
    getAllTeams
} from '../controllers/teamController.js';

const router = new express.Router();

router.route('/teams')
    .all(isAuthenticated, isAdmin)
    .get(getAllTeams)
    .post(createTeam);

export default router;