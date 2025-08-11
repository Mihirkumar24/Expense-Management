import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import CustomApprovalFlow from '../models/CustomApprovalFlow.js';
import Setting from '../models/Setting.js';
import User from '../models/User.js';

export const createCustomApprovalFlow = asyncErrorHandler(async (req, res, next) => {
    const { userId } = req;

    const {
        approvers,
        criteria,
        criteriaPattern,
        module,
        name
    } = req.body;

    const newCustomApprovalFlow = {
        approvers,
        criteria,
        criteriaPattern,
        module,
        name
    };

    const customApprovalFlow = await CustomApprovalFlow.create(newCustomApprovalFlow);

    const user = await User
        .findById(userId)
        .populate('organization');

    const settingId = user.organization.setting;

    const setting = await Setting.findByIdAndUpdate(
        settingId,
        {
            $addToSet: {
                customApprovalFlows: customApprovalFlow
            }
        }
    );

    res.json({ customApprovalFlow });
});

export const getAllCustomApprovalFlows = asyncErrorHandler(async (req, res, next) => {
    const user = await User
        .findById(req.userId)
        .populate({
            path: 'organization',
            populate: {
                path: 'setting',
                populate: {
                    path: 'customApprovalFlows'
                }
            }
        });

    const customApprovalFlows = user.organization.setting.customApprovalFlows;

    res.json({ customApprovalFlows });
});

export const getCustomApprovalFlow = asyncErrorHandler(async (req, res, next) => {
    const { customApprovalFlowId } = req.params;

    const customApprovalFlow = await CustomApprovalFlow.findById(customApprovalFlowId);

    res.json({ customApprovalFlow });
});

export const updateCustomApprovalFlow = asyncErrorHandler(async (req, res, next) => {
    const { customApprovalFlowId } = req.params;

    const {
        approvers,
        criteria,
        criteriaPattern,
        name
    } = req.body;

    const customApprovalFlowUpdate = {
        approvers,
        criteria,
        criteriaPattern,
        name
    };

    console.log(customApprovalFlowId);

    console.log(customApprovalFlowUpdate);

    const customApprovalFlow = await CustomApprovalFlow.findByIdAndUpdate(
        customApprovalFlowId,
        customApprovalFlowUpdate
    );

    res.json({ customApprovalFlow });
});