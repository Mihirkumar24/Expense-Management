import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const customApprovalFlowApi = createApi({
    reducerPath: 'customApprovalFlowApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}/administrator`,
        credentials: 'include'
    }),
    tagTypes: ['CustomApprovalFlow', 'CustomApprovalFlows'],
    endpoints: (builder) => ({
        createCustomApprovalFlow: builder.mutation({
            query: (body) => ({
                url: '/custom-approval-flows',
                method: 'POST',
                body
            }),
            invalidatesTags: ['CustomApprovalFlows']
        }),
        getAllCustomApprovalFlows: builder.query({
            query: () => '/custom-approval-flows',
            providesTags: ['CustomApprovalFlows']
        }),
        getCustomApprovalFlow: builder.query({
            query: (customApprovalFlowId) => `/custom-approval-flows/${customApprovalFlowId}`,
            providesTags: ['CustomApprovalFlow']
        }),
        updateCustomApprovalFlow: builder.mutation({
            query: ({ customApprovalFlowId, body }) => ({
                url: `/custom-approval-flows/${customApprovalFlowId}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['CustomApprovalFlow', 'CustomApprovalFlows']
        })
    })
});

export const {
    useCreateCustomApprovalFlowMutation,
    useGetAllCustomApprovalFlowsQuery,
    useGetCustomApprovalFlowQuery,
    useUpdateCustomApprovalFlowMutation
} = customApprovalFlowApi;

export default customApprovalFlowApi;