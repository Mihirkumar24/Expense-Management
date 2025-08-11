import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';

import Setting from '../models/Setting.js';

export const getSetting = asyncErrorHandler(async (req, res, next) => {
    const setting = await Setting
        .findOne()
        .populate('customApprovalFlows');

    res.json({
        setting
    });
});

export const updateSetting = asyncErrorHandler(async (req, res, next) => {
    const { settingId } = req.params;
    
    const setting = await Setting.findByIdAndUpdate(settingId, req.body);

    res.json({ setting })
});