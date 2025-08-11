import {
    createApi,
    fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

const currencyExchangeRateApi = createApi({
    reducerPath: 'currencyExchangeRateApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies'
    }),
    endpoints: (builder) => ({
        getAllCurrency: builder.query({
            query: () => 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
        }),
        getCurrencyExchangeRate: builder.query({
            query: (currency) => `/${currency}.json`,
            transformResponse: (response, meta, arg) => response[arg]['usd']
        })
    })
});

export const {
    useGetAllCurrencyQuery,
    useLazyGetCurrencyExchangeRateQuery
} = currencyExchangeRateApi;

export default currencyExchangeRateApi;