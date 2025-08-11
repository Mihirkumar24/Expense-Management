import express from 'express';

import {
    isAuthenticated,
    isAdmin
} from '../middlewares/authorization.js';

import {
    createProject,
    getAllProjects,
    getProject
} from '../controllers/projectController.js';

const router = new express.Router();

router.route('/projects')
    .all(isAuthenticated)
    .get(getAllProjects)
    .post(createProject);

router.route('projects/:projectId')
    .all(isAuthenticated, isAdmin)
    .get(getProject);

export default router;