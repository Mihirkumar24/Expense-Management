import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const advanceApi = createApi({
    reducerPath: 'advanceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
        credentials: 'include'
    }),
    tagTypes: ['Advance', 'Advances'],
    endpoints: (builder) => ({
        approveAdvance: builder.mutation({
            query: (advanceId) => ({
                url: `/advances/${advanceId}/approve`,
                method: 'POST',
            }),
            invalidatesTags: ['Advance', 'Advances']
        }),
        createAdvance: builder.mutation({
            query: (body) => ({
                body,
                method: 'POST',
                url: '/advances'
            }),
            invalidatesTags: ['Advances']
        }),
        getAdvance: builder.query({
            query: (advanceId) => `advances/${advanceId}`,
            providesTags: ['Advance']
        }),
        getAllAdvances: builder.query({
            query: (filter) => ({
                params: filter,
                url: '/advances'
            }),
            providesTags: ['Advances']
        }),
        rejectAdvance: builder.mutation({
            query: ({ body, advanceId }) => ({
                url: `/advances/${advanceId}/reject`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['Advance', 'Advances']
        }),
    })
});

export const {
    useApproveAdvanceMutation,
    useCreateAdvanceMutation,
    useGetAdvanceQuery,
    useGetAllAdvancesQuery,
    useLazyGetAllAdvancesQuery,
    useRejectAdvanceMutation
} = advanceApi;

export default advanceApi;