import mongoose from 'mongoose';

const departmentSchema = mongoose.Schema({
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Department head is required.']
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
    },
    teamsCount: {
        type: Number,
        default: 0
    },
});

export default mongoose.model('Department', departmentSchema);