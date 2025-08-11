import mongoose from 'mongoose';

const accountSchema = mongoose.Schema({
    accountNumber: {
        type: Number,
        required: [
            function () {
                return this.type === 'bank'
            },
            'Account number is required.'
        ]
    },
    code: {
        type: String,
        required: 'Code is required.'
    },
    description: String,
    name: {
        type: String,
        required: 'Name is required.'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'Organization is required.']
    },
    type: {
        type: String,
        enum: ['bank', 'cash'],
        required: 'Type is required.'
    }
});

export default mongoose.model('Account', accountSchema);