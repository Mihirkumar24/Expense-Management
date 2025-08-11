import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
    public_id: {
        type: String,
        default: ''
    },
    secure_url: {
        type: String,
        default: ''
    }
});

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Amount is required.']
    },
    businessPurpose: {
        type: String,
        required: [true, 'Business purpose is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    convertedAmount: {
        type: Number,
        required: [true, 'Converted amount is required.']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required.']
    },
    currencyExchangeRate: {
        type: Number,
        required: [true, 'Currency exchange rate is required.']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    'Legal Entity': {
        type: Number,
        default: 22565422580,
        required: 'Legal Entity is required.'
    },
    merchant: {
        type: String,
        required: [true, 'Merchant is required']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required']
    },
    receipt: {
        type: receiptSchema,
        required: [true, 'Receipt is required.']
    },
    status: {
        type: String,
        default: 'unreported',
        enum: ['unreported', 'reported', 'submitted', 'approved', 'rejected'],
        required: [true, 'Status is required']
    },
    submitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Submitter is required.']
    },
});

export default mongoose.model('Expense', expenseSchema);