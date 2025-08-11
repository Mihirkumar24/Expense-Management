import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const budgetApi = createApi({
    reducerPath: 'budgetApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}/administrator/settings`,
        credentials: 'include'
    }),
    tagTypes: ['Budgets'],
    endpoints: (builder) => ({
        createBudget: builder.mutation({
            query: (body) => ({
                url: '/budgets',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Budgets']
        }),
        getAllBudgets: builder.query({
            query: (organizationId) => ({
                url: '/budgets',
                params: {
                    organizationId
                }
            }),
            providesTags: ['Budgets']
        })
    })
});

export const {
    useCreateBudgetMutation,
    useGetAllBudgetsQuery
} = budgetApi;

export default budgetApi;