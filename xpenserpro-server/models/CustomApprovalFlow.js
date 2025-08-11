import mongoose from 'mongoose';

const criterionSchema = new mongoose.Schema({
    field: {
        type: String,
        enum: [
            'amount',
            'department',
            'expenseCategory',
            'project',
            'team'
        ],
        required: 'Field is required.'
    },
    comparator: {
        type: String,
        enum: [
            'lessThan',
            'lessThanEqualTo',
            'equalTo',
            'greaterThanEqualTo',
            'greaterThan'
        ],
        required: 'Comparator is required.'
    },
    value: {
        type: String,
        required: 'Value is required.'
    }
});

const approverSchema = mongoose.Schema({
    subType: {
        type: String,
        required: [
            function () {
                return (
                    this.type === 'departmentHead'
                    || this.type === 'hierarchy'
                    || this.type === 'manual'
                    || this.type === 'projectHead'
                    || this.type === 'teamHead'
                );
            },
            'Subtype is required.'
        ]
    },
    type: {
        type: String,
        enum: [
            'departmentHead',
            'departmentHeadOfTheCreator',
            'hierarchy',
            'manual',
            'projectHead',
            'teamHead',
            'teamHeadOfTheCreator'
        ],
        required: 'Type is required.'
    }
});

const customApprovalFlowSchema = mongoose.Schema({
    approvers: {
        type: [approverSchema],
        required: 'Approvers are required.'
    },
    criteria: {
        type: [criterionSchema],
        required: 'Criteria are required.'
    },
    criteriaPattern: {
        type: String,
        required: 'Criteria pattern is required.'
    },
    module: {
        type: String,
        enum: ['advances', 'report'],
        required: 'Module is required'
    },
    name: {
        type: String,
        required: 'Name is required.'
    }
});

export default mongoose.model('CustomApprovalFlow', customApprovalFlowSchema);