import mongoose from 'mongoose';

const teamSchema = mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: [true, 'Department is required.']
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Team head is required.']
    },
    membersCount: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: [true, 'Name is required.']
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'Organization is required']
    }
});

export default mongoose.model('Team', teamSchema);