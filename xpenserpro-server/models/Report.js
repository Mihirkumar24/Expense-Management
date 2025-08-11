import mongoose from 'mongoose';

const commentatorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: ['First name is required.']
    },
    lastName: {
        type: String,
        required: ['Last name is required.']
    }
});

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: ['Comment is required.']
    },
    commentator: {
        type: commentatorSchema,
        required: ['Commentator is required.']
    }
});

const reportSchema = new mongoose.Schema({
    advanceAmount: {
        default: 0,
        type: Number,
        required: 'Advance amount is required.'
    },
    advances: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Advance'
    },
    amount: {
        default: 0,
        type: Number,
        required: [true, 'Amount is required']
    },
    approvalFlow: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    approvalFlowLevel: {
        type: Number,
        default: 0
    },
    approvalFlowType: {
        type: String,
        default: 'hierarchy',
        enum: ['custom', 'hierarchy'],
        required: [true, 'Approval flow type is required.']
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [function () { return this.status !== 'draft' }, 'Approver is required.']
    },
    businessPurpose: {
        type: String,
        required: [true, 'Business Purpose is required']
    },
    comments: {
        type: [commentSchema]
    },
    date: {
        from: {
            type: Date,
            required: [true, 'Date from is required.']
        },
        to: {
            type: Date,
            required: [true, 'Date to is required.']
        }
    },
    expenses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Expense'
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    reimbursableAmount: {
        default: 0,
        type: Number,
        required: 'Reimbursable amount is required.'
    },
    rejectReason: {
        type: String,
        required: [
            function () {
                return this.status === 'reject'
            },
            'Reason for reject is required.'
        ]
    },
    status: {
        type: String,
        default: 'draft',
        enum: ['draft', 'submitted', 'approved', 'rejected'],
        required: [true, 'Status is required']
    },
    submitter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Submitter is required.']
    }
});

export default mongoose.model('Report', reportSchema);