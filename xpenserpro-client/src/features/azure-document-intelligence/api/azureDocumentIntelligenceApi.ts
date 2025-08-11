import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const azureDocumentIntelligenceApi = createApi({
    reducerPath: 'azureDocumentIntelligenceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_SERVER_URL}/azure-document-intelligence`,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        analyze: builder.mutation({
            query: (body) => ({
                url: '/analyze',
                method: 'POST',
                body
            }),
        })
    })
});

export const {
    useAnalyzeMutation
} = azureDocumentIntelligenceApi;

export default azureDocumentIntelligenceApi;