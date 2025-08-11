import crypto from 'crypto';

import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import CustomError from '../utils/CustomError.js';
import { invitationMailTemplate } from '../utils/mailTemplates.js';
import sendMail from '../utils/sendMail.js';

import Organization from '../models/Organization.js';
import User from '../models/User.js';

export const acceptInvitation = asyncErrorHandler(async (req, res, next) => {
    const { invitationToken } = req.params;

    const invitationTokenHash = crypto
        .createHash('sha256')
        .update(invitationToken)
        .digest('hex');

    const user = await User.findOne({
        invitationTokenHash,
        invitationTokenHashExpiryDate: {
            $gt: Date.now()
        }
    });

    if (!user) {
        new CustomError('Invitation link has expired.', 400);
    }

    const {
        confirmPassword,
        password
    } = req.body;

    user.invitationTokenHash = undefined;
    user.invitationTokenHashExpiryDate = undefined;
    user.password = password;
    user.status = 'active';

    await user.save();

    res.json({ user });
});

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const {
        organization,
        roles,
        status = 'active'
    } = req.query;

    const filter = { organization };

    if (roles) {
        filter.role = {
            $in: roles.split(',')
        }
    }

    if (status !== 'all') {
        filter.status = status;
    }

    const users = await User
        .find(filter)
        .populate('approver');

    res.json({ users });
});

export const getMe = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    const user = await User
        .findById(userId)
        .populate({
            path: 'organization',
            populate: {
                path: 'setting'
            }
        });

    res.json({ user });
});

export const getUser = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req.params;

    const user = await User
        .findById(userId)
        .populate('approver department policy team');

    console.log(user);

    res.json({ user });
});

export const inviteUser = asyncErrorHandler(async (req, res, next) => {
    const {
        approver,
        email,
        department,
        firstName,
        lastName,
        level,
        organization,
        policy,
        role,
        team
    } = req.body;

    const newUser = {
        approver,
        email: email.toLowerCase(),
        firstName,
        lastName,
        level,
        organization,
        policy,
        role
    }

    if (department) {
        newUser.department = department;
    }

    if (team) {
        newUser.team = team;
    }

    const user = await User.create(newUser);

    const invitationToken = user.generateInvitationToken();

    await user.save();

    const organizationDocument = await Organization.findById(organization);

    const html = invitationMailTemplate(invitationToken, organizationDocument.name);

    await sendMail(
        user.email,
        'Invitation to join XPENSERPRO organization',
        html
    );

    res.json({ user });
});

export const updateUser = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req.params;

    const {
        approver,
        email,
        department,
        firstName,
        lastName,
        level,
        policy,
        role,
        team
    } = req.body;

    const userUpdate = {
        approver,
        email,
        firstName,
        lastName,
        level,
        policy,
        role
    }

    if (department) {
        userUpdate.department = department;
    }

    if (team) {
        userUpdate.team = team;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        userUpdate
    );

    res.json({ user });
});