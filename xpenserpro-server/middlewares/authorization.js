import jwt from 'jsonwebtoken';

import asyncErrorHandler from './asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

import User from '../models/User.js';

export const isAuthenticated = asyncErrorHandler(async (req, res, next) => {
    const { session } = req.cookies;

    if (!session) {
        throw new CustomError('Please login to access this route', 400);
    }
    
    const decoded = jwt.verify(session, process.env.JWT_PRIVATE_KEY);

    req.userId = decoded.userId;

    next();
});

export const isAdmin = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (!user.role.includes('administrator')) {
        throw new CustomError('You are not authorized to access this route', 400);
    }

    next();
})