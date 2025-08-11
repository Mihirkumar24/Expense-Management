import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

import Organization from '../models/Organization.js';
import Setting from '../models/Setting.js';
import User from '../models/User.js';

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
    const { resetPasswordToken } = req.params;

    const resetPasswordTokenHash = crypto
        .createHash('sha256')
        .update(resetPasswordToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordTokenHash,
        resetPasswordTokenHashExpiryDate: {
            $gt: Date.now()
        }
    });

    if (!user) {
        new CustomError('Reset password link has expired.', 400);
    }

    const {
        confirmPassword,
        password
    } = req.body;

    user.password = password;

    user.resetPasswordTokenHash = undefined;
    user.resetPasswordTokenHashExpiryDate = undefined;

    await user.save();
});

// api/v1/sign_in

export const signIn = asyncErrorHandler(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    const user = await User.findOne(
        {
            email: email.toLowerCase(),
            status: 'active'
        },
        'password'
    );

    if (!user) {
        throw new CustomError('Couldn\'t find your account.', 404);
    }

    const isPasswordValid = user.validatePassword(password);

    if (!isPasswordValid) {
        throw new CustomError('Wrong password. Try again or click Forgot password to reset it.', 401);
    }

    const token = user.generateJwt(user);

    res.cookie(
        'session',
        token,
        {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
    ).json({
        session: token
    });
});

// api/v1/sign_out

export const signOut = asyncErrorHandler(async (req, res, next) => {
    res.clearCookie(
        'session',
        {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
    ).json({
        message: 'Sign out successful'
    });
});

export const signUp = asyncErrorHandler(async (req, res, next) => {
    const {
        email,
        firstName,
        lastName,
        organization: organizationName,
        password
    } = req.body;

    let user = await User.findOne({ email });

    if (user) {
        throw new CustomError('This email is already in use.', 400);
    }

    const setting = await Setting.create({});

    const organization = await Organization.create({
        name: organizationName,
        setting: setting.id
    });

    const newUser = {
        email,
        firstName,
        lastName,
        organization,
        password,
        role: 'administrator',
        status: 'active'
    }

    user = await User.create(newUser);

    const token = user.generateJwt(user);

    res.cookie(
        'session',
        token,
        {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
    ).json({
        session: token
    });
});