import mongoose from 'mongoose';

const budgetSchema = mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: 'Account is required.'
    },
    amount: {
        type: Number,
        required: 'Amount is required.'
    },
    convertedAmount: {
        type: Number,
        required: 'Converted amount is required.'
    },
    currency: {
        type: String,
        required: 'Currency is required.'
    },
    currencyExchangeRate: {
        type: Number,
        required: 'Currency exchange rate is required.'
    },
    date: {
        from: {
            type: Date,
            required: 'From date is required.'
        },
        to: {
            type: Date,
            required: 'To date is required.'
        }
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: 'Department is required.'
    },
    expenseCategory: {
        type: String,
        required: 'Expense category is required.'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: 'Organization is required.'
    }
});

export default mongoose.model('Budget', budgetSchema);