import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const expenseApi = createApi({
    reducerPath: 'expenseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        credentials: 'include'
    }),
    tagTypes: ['Expense'],
    endpoints: (builder) => ({
        createExpense: builder.mutation({
            query: (body) => ({
                url: '/expenses',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Expense']
        }),
        deleteExpense: builder.mutation({
            query: (expenseId) => ({
                url: `/expenses/${expenseId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Expense']
        }),
        getAllExpenses: builder.query({
            query: (filter) => ({
                params: filter,
                url: '/expenses',
            }),
            providesTags: ['Expense']
        }),
        getExpense: builder.query({
            query: (expenseId) => `/expenses/${expenseId}`
        })
    })
});

export const {
    useCreateExpenseMutation,
    useDeleteExpenseMutation,
    useGetAllExpensesQuery,
    useLazyGetAllExpensesQuery,
    useGetExpenseQuery,
} = expenseApi;

export default expenseApi;