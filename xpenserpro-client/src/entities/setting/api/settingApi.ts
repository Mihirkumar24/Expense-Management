import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const settingApi = createApi({
    reducerPath: 'settingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        getSetting: builder.query({
            query: () => '/setting'
        }),
        updateSetting: builder.mutation({
            query: ({ body, settingId }) => ({
                url: `/setting/${settingId}`,
                method: 'PATCH',
                body
            })
        })
    })
});

export const {
    useGetSettingQuery,
    useUpdateSettingMutation
} = settingApi;

export default settingApi;