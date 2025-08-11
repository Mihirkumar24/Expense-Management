import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const departmentApi = createApi({
    reducerPath: 'departmentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}/administrator/settings`,
        credentials: 'include'
    }),
    tagTypes: ['Department'],
    endpoints: (builder) => ({
        createDepartment: builder.mutation({
            query: (body) => ({
                url: '/departments',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Department']
        }),
        getAllDepartments: builder.query({
            query: (organizationId) => ({
                url: '/departments',
                params: {
                    organizationId
                }
            }),
            providesTags: ['Department']
        })
    })
});

export const {
    useCreateDepartmentMutation,
    useGetAllDepartmentsQuery,
    useLazyGetAllDepartmentsQuery
} = departmentApi;

export default departmentApi;