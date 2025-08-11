import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const teamApi = createApi({
    reducerPath: 'teamApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}/administrator/settings`,
        credentials: 'include'
    }),
    tagTypes: ['Team'],
    endpoints: (builder) => ({
        createTeam: builder.mutation({
            query: (body) => ({
                url: '/teams',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Team']
        }),
        getAllTeams: builder.query({
            query: (organizationId) => ({
                url: '/teams',
                params: {
                    organizationId
                }
            }),
            providesTags: ['Team']
        })
    })
});

export const {
    useCreateTeamMutation,
    useGetAllTeamsQuery,
    useLazyGetAllTeamsQuery
} = teamApi;

export default teamApi;