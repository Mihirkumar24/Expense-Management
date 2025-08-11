import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

import Department from '../models/Department.js';
import Team from '../models/Team.js';

export const createTeam = asyncErrorHandler(async (req, res, next) => {
    const {
        department,
        head,
        name,
        organizationId
    } = req.body;

    await Department.findByIdAndUpdate(
        department,
        {
            $inc: {
                teamsCount: 1
            }
        }
    );

    const newTeam = {
        department,
        head,
        name,
        organization: organizationId
    };

    const team = await Team.create(newTeam);

    res.json({
        team
    });
});

export const getAllTeams = asyncErrorHandler(async (req, res, next) => {
    const {
        organizationId
    } = req.query;

    const filter = {
        organization: organizationId
    };

    const teams = await Team.find(filter)
        .populate({
            path: 'department',
            populate: {
                path: 'head',
                select: 'firstName lastName'
            },
            select: 'head'
        })
        .populate({
            path: 'head',
            select: 'firstName lastName'
        });

    res.json({
        teams
    });
});