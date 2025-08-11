import mongoose from 'mongoose';

const accountPayableSchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is required.']
    },
    transactionDate: {
        type: Date,
        required: 'Transaction date is required.'
    },
    transactionType: {
        type: String,
        enum: [
            'Office Expenses',
            'Telephone Expenses',
            'Electricity',
            'Commission',
            'Purchase Expenses',
            'Employee Training Expenses'
        ],
        required: 'Transaction type is required.'
    },
    invoiceDate: {
        type: Date,
        required: 'Invoice date is required.'
    },
    company: {
        type: String,
        enum: [
            'USMF',
            'INMF',
            'USPM',
            'USSI'
        ],
        required: 'Company is required.'
    },
    mainAccount: {
        type: String,
        required: 'Main account is required.'
    },
    description: {
        type: String,
        required: 'Description is required.'
    },
    debit: {
        type: Number,
        required: 'Debit amount is required.'
    },
    credit: {
        type: Number,
        required: 'Credit amount is required.'
    },
    offsetAccount: {
        type: String,
        required: 'Offset account is required.'
    },
    methodOfPayment: {
        type: String,
        required: 'Method of payment is required.'
    },
    termsOfPayment: {
        type: String,
        enum: [
            'Cash',
            'COD',
            'NET30'
        ],
        required: 'Terms of payment is required.'
    },
    dueDate: {
        type: Date,
        required: 'Due date is required.'
    },
    exchangeRate: {
        type: Number,
        required: 'Exchange rate is required.'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: 'Organization is required.'
    }
});

export default mongoose.model('AccountPayable', accountPayableSchema);
