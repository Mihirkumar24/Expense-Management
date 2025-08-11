export type { Account } from './model/type';

export {
    default,
    useCreateAccountMutation,
    useGetAllAccountsQuery,
    useLazyGetAllAccountsQuery
} from './api/accountApi';