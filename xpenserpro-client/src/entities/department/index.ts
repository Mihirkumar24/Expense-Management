export type { Department } from './model/type';

export {
    default,
    useCreateDepartmentMutation,
    useGetAllDepartmentsQuery,
    useLazyGetAllDepartmentsQuery
} from './api/departmentApi';
