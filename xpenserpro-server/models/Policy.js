import mongoose from 'mongoose';

const expenseCategorySchema = new mongoose.Schema({
    expenseCategory: {
        type: String,
        required: 'Expense category is required.'
    },
    expenseCategoryLimit: {
        type: Number,
        required: 'Expense limit is required.',
    }
});

const policySchema = new mongoose.Schema({
    description: {
        type: String
    },
    expenseCategories: {
        type: [expenseCategorySchema],
        required: 'Expense categories are required.'
    },
    name: {
        type: String,
        required: 'Policy name is required.'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: 'Organization is required.'
    }
});

export default mongoose.model('Policy', policySchema);
