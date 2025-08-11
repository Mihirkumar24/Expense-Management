import express from 'express';

import {
    isAdmin,
    isAuthenticated
} from '../middlewares/authorization.js';

import {
    acceptInvitation,
    getAllUsers,
    getMe,
    getUser,
    inviteUser,
    updateUser
} from '../controllers/userController.js';

const router = express.Router();

router.route('/invitation/:invitationToken').post(acceptInvitation);

router.route('/users').get(isAuthenticated, getAllUsers);

router.route('/users/me').get(isAuthenticated, getMe);

router.route('/administrator/settings/users/invite').post(isAuthenticated, isAdmin, inviteUser);

router.route('/administrator/settings/users/:userId')
    .get(isAuthenticated, isAdmin, getUser)
    .post(isAuthenticated, isAdmin, updateUser);

export default router;