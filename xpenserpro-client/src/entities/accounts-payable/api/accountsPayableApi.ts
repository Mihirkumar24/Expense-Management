import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const accountsPayableApi = createApi({
    reducerPath: 'accountsPayableApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
        credentials: 'include'
    }),
    tagTypes: ['Accounts Payable'],
    endpoints: (builder) => ({
        createAccountsPayable: builder.mutation({
            query: (body) => ({
                url: '/accounts-payable',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Accounts Payable']
        }),
        getAllAccountsPayable: builder.query({
            query: (organizationId) => ({
                url: '/accounts-payable',
                params: {
                    organizationId
                }
            }),
            providesTags: ['Accounts Payable']
        })
    })
});

export const {
    useCreateAccountsPayableMutation,
    useGetAllAccountsPayableQuery
} = accountsPayableApi;

export default accountsPayableApi;