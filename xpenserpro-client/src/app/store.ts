import { configureStore } from '@reduxjs/toolkit';

import { expensesReducer } from '@/entities/expense';
import { meReducer } from '@/entities/me';

import accountApi from '@/entities/account';
import accountsPayableApi from '@/entities/accounts-payable';
import advanceApi from '@/entities/advance';
import budgetApi from '@/entities/budget';
import customApprovalFlowApi from '@/entities/custom-apprval-flow';
import departmentApi from '@/entities/department';
import { expenseApi } from '@/entities/expense';
import { meApi } from '@/entities/me';
import policyApi from '@/entities/policy';
import projectApi from '@/entities/project';
import reportApi from '@/entities/report';
import settingApi from '@/entities/setting';
import teamApi from '@/entities/team';
import userApi from '@/entities/user';

import authenticationApi from '@/features/authentication';
import azureDocumentIntelligenceApi from '@/features/azure-document-intelligence';
import currencyExchangeRateApi from '@/features/currency-exchange-rate';
import dashboardApi from '@/features/dashboard';

export default configureStore({
    reducer: {
        authentication: meReducer,
        expenses: expensesReducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [accountsPayableApi.reducerPath]: accountsPayableApi.reducer,
        [advanceApi.reducerPath]: advanceApi.reducer,
        [authenticationApi.reducerPath]: authenticationApi.reducer,
        [budgetApi.reducerPath]: budgetApi.reducer,
        [currencyExchangeRateApi.reducerPath]: currencyExchangeRateApi.reducer,
        [customApprovalFlowApi.reducerPath]: customApprovalFlowApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [expenseApi.reducerPath]: expenseApi.reducer,
        [meApi.reducerPath]: meApi.reducer,
        [policyApi.reducerPath]: policyApi.reducer,
        [azureDocumentIntelligenceApi.reducerPath]: azureDocumentIntelligenceApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [reportApi.reducerPath]: reportApi.reducer,
        [settingApi.reducerPath]: settingApi.reducer,
        [teamApi.reducerPath]: teamApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        accountApi.middleware,
        accountsPayableApi.middleware,
        advanceApi.middleware,
        authenticationApi.middleware,
        budgetApi.middleware,
        currencyExchangeRateApi.middleware,
        customApprovalFlowApi.middleware,
        dashboardApi.middleware,
        departmentApi.middleware,
        expenseApi.middleware,
        meApi.middleware,
        policyApi.middleware,
        azureDocumentIntelligenceApi.middleware,
        projectApi.middleware,
        reportApi.middleware,
        settingApi.middleware,
        teamApi.middleware,
        userApi.middleware
    )
});