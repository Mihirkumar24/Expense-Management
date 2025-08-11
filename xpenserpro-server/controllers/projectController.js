import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import Project from '../models/Project.js';

export const createProject = asyncErrorHandler(async (req, res, next) => {
    const {
        head,
        members,
        name,
        organizationId
    } = req.body;

    const newProject = {
        head,
        members,
        name,
        organization: organizationId
    };

    const project = await Project.create(newProject);

    res.json({
        project
    });
});

export const getAllProjects = asyncErrorHandler(async (req, res, next) => {
    const {
        organizationId
    } = req.query;

    const filter = {
        organization: organizationId
    };

    const projects = await Project.find(filter)
        .populate('head');

    res.json({
        projects
    });
});

export const getProject = asyncErrorHandler(async (req, res, next) => {
    const {
        projectId
    } = req.params;

    const project = await Project.findById(projectId)
        .populate('head')
        .populate('members');

    res.json({
        project
    });
});