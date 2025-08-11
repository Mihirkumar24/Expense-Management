import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

import {
    setIsAuthenticated,
    setIsLoading,
    setUser
} from '../model/meSlice';

const meApi = createApi({
    reducerPath: 'meApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => '/users/me',
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setIsLoading(false));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setUser(data.user));
                } catch (error) {
                    dispatch(setIsLoading(false));

                    console.error(error);
                }
            }
        })
    })
});

export const {
    useGetMeQuery
} = meApi;

export default meApi;