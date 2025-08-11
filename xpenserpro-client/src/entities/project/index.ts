export type { Project } from './model/type';

export {
    default,
    useGetAllProjectsQuery,
    useLazyGetAllProjectsQuery,
    useGetProjectQuery
} from './api/projectApi';