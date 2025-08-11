import mongoose from 'mongoose';

const advanceSchema = mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: 'Account is required.'
    },
    amount: {
        type: Number,
        required: 'Amount is required.'
    },
    approvalFlow: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: 'Approval flow is required.'
    },
    approvalFlowLevel: {
        type: Number,
        default: 0
    },
    approvalFlowType: {
        type: String,
        default: 'hierarchy',
        enum: ['custom', 'hierarchy'],
        required: 'Approval flow type is required.'
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [function () { return this.status !== 'draft' }, 'Approver is required.']
    },
    businessPurpose: {
        type: String,
        required: 'Business purpose is required.'
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
    description: String,
    date: {
        type: Date,
        required: 'Date is required.'
    },
    expenseCategory: {
        type: String,
        required: 'Expense category is required.'
    },
    reason: {
        type: String,
        required: [
            function () {
                return this.status === 'reject'
            },
            'Reason for reject is required.'
        ]
    },
    referenceNumber: {
        type: String,
        required: 'Reference number is required.'
    },
    report: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        required: [
            function () {
                this.status === 'reported'
            },
            'Report is required.'
        ]
    },
    reportStatus: {
        type: String,
        default: 'notApplied',
        enum: ['applied', 'notApplied']
    },
    status: {
        type: String,
        default: 'submitted',
        enum: ['approved', 'submitted', 'rejected']
    },
    submitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'Submitter is required.'
    }
});

export default mongoose.model('Advance', advanceSchema);