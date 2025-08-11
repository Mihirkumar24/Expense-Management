import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}/administrator/settings`,
        credentials: 'include'
    }),
    tagTypes: ['Project'],
    endpoints: (builder) => ({
        createProject: builder.mutation({
            query: (body) => ({
                url: '/projects',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Project']
        }),
        getAllProjects: builder.query({
            query: (organizationId) => ({
                url: '/projects',
                params: {
                    organizationId
                }
            }),
            providesTags: ['Project']
        }),
        getProject: builder.query({
            query: (projectId) => `projects/${projectId}`,
            providesTags: ['Project']
        })
    })
});

export const {
    useCreateProjectMutation,
    useGetAllProjectsQuery,
    useLazyGetAllProjectsQuery,
    useGetProjectQuery
} = projectApi;

export default projectApi;