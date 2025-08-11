import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    baseCurrency: {
        type: 'String',
        default: 'usd',
        required: [true, 'Base currency is required']
    },
    customApprovalFlows: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'CustomApprovalFlow'
    }
});

export default mongoose.model('Setting', settingSchema);