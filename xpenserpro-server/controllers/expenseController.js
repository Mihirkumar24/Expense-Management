import _ from 'lodash';

import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import { uploadFile } from '../utils/cloudinary.js';

import Expense from '../models/Expense.js';
import User from '../models/User.js';

export const createExpense = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userId;

    const {
        amount,
        businessPurpose,
        category,
        currency,
        currencyExchangeRate,
        date,
        description,
        merchant,
        paymentMethod,
        receiptBase64String
    } = req.body;

    const receipt = {
        public_id: '',
        secure_url: ''
    };

    try {
        const {
            public_id,
            secure_url
        } = await uploadFile(receiptBase64String, 'Expense/receipt');

        receipt.public_id = public_id;
        receipt.secure_url = secure_url;
    } catch (error) {
        console.error(error)
    }

    const newExpense = {
        amount,
        businessPurpose,
        category,
        convertedAmount: _.round(amount * currencyExchangeRate, 2),
        currency,
        currencyExchangeRate,
        date,
        description,
        merchant,
        paymentMethod,
        receipt,
        submitter: userId,
    };

    const expense = await Expense.create(newExpense);

    res.status(201).json({ expense });
});

export const deleteExpense = asyncErrorHandler(async (req, res, next) => {
    const { expenseId } = req.params;

    const expense = await Expense.findByIdAndDelete(expenseId);

    res.json({ expense });
});

export const getAllExpenses = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userId;

    const {
        category,
        date,
        limit = 10,
        merchant,
        page = 1,
        status
    } = req.query;

    const filter = {
        submitter: userId
    };

    if (category) {
        filter.category = category;
    }

    if (date) {
        if (date.from) {
            filter.date.$gte = date.from;
        }

        if (date.to) {
            filter.date.$lte = date.to;
        }
    }

    if (merchant) {
        filter.merchant = merchant;
    }

    if (status) {
        filter.status = {
            $in: status.split(',')
        };
    }

    const skip = (page - 1) * limit;

    const expenses = await Expense
        .find(filter)
        .populate('submitter', 'email firstName lastName role')
        .skip(skip)
        .limit(limit);

    const count = await Expense.countDocuments(filter);

    res.json({
        count,
        expenses
    });
});

export const getExpense = asyncErrorHandler(async (req, res, next) => {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    res.json({
        expense
    });
});