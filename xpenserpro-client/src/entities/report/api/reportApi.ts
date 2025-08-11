import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const reportApi = createApi({
    reducerPath: 'reportApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL, credentials: 'include' }),
    tagTypes: ['Report'],
    endpoints: (builder) => ({
        addCommentToReport: builder.mutation({
            query: ({ body, reportId }) => ({
                url: `/reports/${reportId}/comment`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Report']
        }),
        addExpensesToReport: builder.mutation({
            query: ({ body, reportId }) => ({
                url: `/reports/${reportId}/add-expenses`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Report']
        }),
        applyAdvanceToReport: builder.mutation({
            query: ({ body, reportId }) => ({
                url: `/reports/${reportId}/apply-advance-to-report`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Report']
        }),
        approveReport: builder.mutation({
            query: (reportId) => ({
                url: `/reports/${reportId}/approve`,
                method: 'POST',
            }),
            invalidatesTags: ['Report']
        }),
        createReport: builder.mutation({
            query: (body) => ({
                url: '/reports',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Report']
        }),
        delegateReport: builder.mutation({
            query: ({ body, reportId }) => ({
                url: `/reports/${reportId}/delegate`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Report']
        }),
        getAllReports: builder.query({
            query: (filter) => ({
                url: '/reports',
                params: filter
            }),
            providesTags: ['Report']
        }),
        getReport: builder.query({
            query: (reportId) => `/reports/${reportId}`,
            providesTags: ['Report']
        }),
        rejectReport: builder.mutation({
            query: ({ body, reportId }) => ({
                url: `/reports/${reportId}/reject`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Report']
        }),
        removeExpenseFromReport: builder.mutation({
            query: ({ body, reportId }) => ({
                url: `/reports/${reportId}/remove-expense`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Report']
        }),
        submitReport: builder.mutation({
            query: (reportId) => ({
                url: `/reports/${reportId}/submit`,
                method: 'POST',
            }),
            invalidatesTags: ['Report']
        })
    })
});

export const {
    useAddCommentToReportMutation,
    useAddExpensesToReportMutation,
    useApplyAdvanceToReportMutation,
    useApproveReportMutation,
    useCreateReportMutation,
    useDelegateReportMutation,
    useGetAllReportsQuery,
    useLazyGetAllReportsQuery,
    useGetReportQuery,
    useRejectReportMutation,
    useRemoveExpenseFromReportMutation,
    useSubmitReportMutation
} = reportApi;

export default reportApi;