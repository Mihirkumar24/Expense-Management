import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        getDashboard: builder.query({
            query: () => '/dashboard',
        })
    })
});

export const {
    useGetDashboardQuery
} = dashboardApi;

export default dashboardApi;