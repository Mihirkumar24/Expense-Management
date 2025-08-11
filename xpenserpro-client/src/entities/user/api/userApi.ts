import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        credentials: 'include'
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        acceptInvitation: builder.mutation({
            query: ({ body, invitationToken }) => ({
                url: `invitation/${invitationToken}`,
                method: 'POST',
                body
            })
        }),
        getAllUsers: builder.query({
            query: ({ organization, roles, status }) => ({
                url: '/users',
                params: {
                    organization,
                    roles,
                    status
                }
            }),
            providesTags: ['User']
        }),
        getUser: builder.query({
            query: (userId) => `administrator/settings/users/${userId}`,
            providesTags: ['User']
        }),
        inviteUser: builder.mutation({
            query: (body) => ({
                url: 'administrator/settings/users/invite',
                method: 'POST',
                body
            }),
            invalidatesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: ({ body, userId }) => ({
                url: `administrator/settings/users/${userId}`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['User']
        }),
    })
});

export const {
    useAcceptInvitationMutation,
    useGetAllUsersQuery,
    useLazyGetAllUsersQuery,
    useGetUserQuery,
    useInviteUserMutation,
    useUpdateUserMutation
} = userApi;

export default userApi;