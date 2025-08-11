import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const policyApi = createApi({
    reducerPath: 'policyApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
        credentials: 'include'
    }),
    tagTypes: ['Policy', 'Policies'],
    endpoints: (builder) => ({
        createPolicy: builder.mutation({
            query: ({
                body,
                organizationId
            }) => ({
                url: '/administrator/settings/policies',
                method: 'POST',
                body,
                params: {
                    organizationId
                }
            }),
            invalidatesTags: ['Policies']
        }),
        getAllPolicies: builder.query({
            query: (organizationId) => ({
                url: '/policies',
                params: {
                    organizationId
                }
            }),
            providesTags: ['Policies']
        }),
        getPolicy: builder.query({
            query: (policyId) => `/administrator/settings/policies/${policyId}`,
            providesTags: ['Policy']
        }),
        updatePolicy: builder.mutation({
            query: ({
                body,
                policyId
            }) => ({
                url: `/administrator/settings/policies/${policyId}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Policy', 'Policies']
        }),
    })
});

export const {
    useCreatePolicyMutation,
    useGetAllPoliciesQuery,
    useLazyGetAllPoliciesQuery,
    useGetPolicyQuery,
    useUpdatePolicyMutation
} = policyApi;

export default policyApi;
