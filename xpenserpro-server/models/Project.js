import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: ['Head is required.']
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: [true, 'Members is required.']
    },
    name: {
        type: String,
        required: ['Name is required.']
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'Organization is required.']
    }
});

export default mongoose.model('Project', projectSchema);