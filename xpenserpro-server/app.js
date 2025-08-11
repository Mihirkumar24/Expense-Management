import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import accountsPayableRouter from './routers/accountsPayableRouter.js';
import accountRouter from './routers/accountRouter.js';
import advanceRouter from './routers/advanceRouter.js'
import authenticationRouter from './routers/authenticationRouter.js';
import azureDocumentIntelligenceRouter from './routers/azureDocumentIntelligenceRouter.js';
import customApprovalFlowRouter from './routers/customApprovalFlowRouter.js';
import dashboardRouter from './routers/dashboardRouter.js';
import expenseRouter from './routers/expenseRouter.js';
import settingRouter from './routers/settingRouter.js';
import reportRouter from './routers/reportRouter.js';
import userRouter from './routers/userRouter.js';

import budgetRouter from './routers/budgetRouter.js';
import departmentRouter from './routers/departmentRouter.js';
import policyRouter from './routers/policyRouter.js';
import projectRouter from './routers/projectRouter.js';
import teamRouter from './routers/teamRouter.js';

mongoose.connect(process.env.MONGODB_URI)
    .then(console.log('Connected to MongoDB'))
    .catch((error) => console.error(error));

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api/v1', accountsPayableRouter);
app.use('/api/v1', accountRouter);
app.use('/api/v1', advanceRouter);
app.use('/api/v1', authenticationRouter);
app.use('/api/v1', azureDocumentIntelligenceRouter);
app.use('/api/v1', customApprovalFlowRouter);
app.use('/api/v1', dashboardRouter);
app.use('/api/v1', expenseRouter);
app.use('/api/v1', policyRouter)
app.use('/api/v1', settingRouter);
app.use('/api/v1', reportRouter);
app.use('/api/v1', userRouter);

app.use('/api/v1/administrator/settings', budgetRouter);
app.use('/api/v1/administrator/settings', budgetRouter);
app.use('/api/v1/administrator/settings', departmentRouter);
app.use('/api/v1/administrator/settings', projectRouter);
app.use('/api/v1/administrator/settings', teamRouter);

function errorHandler(err, req, res, next) {
    console.error(err);

    const { message, statusCode } = err;

    res.status(statusCode).json({
        message
    });
}

app.use(errorHandler);

const port = process.env.PORT;

const server = app.listen(port, () => {
    console.log(`Expense listening on port ${port}`);
});