export type { Team } from './model/type';

export {
    default,
    useCreateTeamMutation,
    useGetAllTeamsQuery,
    useLazyGetAllTeamsQuery
} from './api/teamApi';