import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}/administrator`,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        createAccount: builder.mutation({
            query: ({
                body,
                organizationId
            }) => ({
                body,
                method: 'POST',
                params: {
                    organizationId
                },
                url: '/accounts'
            })
        }),
        getAllAccounts: builder.query({
            query: (organizationId) => ({
                params: {
                    organizationId
                },
                url: '/accounts'
            })
        })
    })
});

export const {
    useCreateAccountMutation,
    useGetAllAccountsQuery,
    useLazyGetAllAccountsQuery
} = accountApi;

export default accountApi;