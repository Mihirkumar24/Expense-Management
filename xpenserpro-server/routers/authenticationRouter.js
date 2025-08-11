import express from 'express';

import {
    signIn,
    signOut,
    signUp
} from '../controllers/authenticationController.js';

const router = new express.Router();

router.route('/sign-in').post(signIn);
router.route('/sign-out').post(signOut);
router.route('/sign-up').post(signUp);

export default router;