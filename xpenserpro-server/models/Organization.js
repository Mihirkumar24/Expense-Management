import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
    name: {
        type: 'String',
        required: [true, 'Name is required']
    },
    setting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Setting',
        required: [true, 'Setting is required']
    }
});

export default mongoose.model('Organization', organizationSchema);