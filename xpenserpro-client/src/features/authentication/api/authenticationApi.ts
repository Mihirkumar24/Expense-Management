import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

import { meApi } from '@/entities/me';

const authenticationApi = createApi({
    reducerPath: 'authenticationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (body) => ({
                url: '/sign-in',
                method: 'POST',
                body
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    await dispatch(meApi.endpoints.getMe.initiate());
                } catch (error) {
                    console.error(error);
                }
            }
        }),
        signOut: builder.mutation({
            query: () => ({
                url: '/sign-out',
                method: 'POST'
            })
        }),
        signUp: builder.mutation({
            query: (body) => ({
                url: '/sign-up',
                method: 'POST',
                body
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    await dispatch(meApi.endpoints.getMe.initiate());
                } catch (error) {
                    console.error(error);
                }
            }
        })
    })
});

export const {
    useSignInMutation,
    useSignOutMutation,
    useSignUpMutation
} = authenticationApi;

export default authenticationApi;