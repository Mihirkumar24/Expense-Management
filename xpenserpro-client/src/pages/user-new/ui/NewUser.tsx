import { useParams } from 'react-router';

import { useGetUserQuery } from '@/entities/user';

import Loader from '@/widgets/loader';

import NewUserForm from './NewUserForm';

export default function NewUser() {
    const { userId } = useParams();
    const isUpdating = Boolean(userId);

    const {
        data: getUserData,
        isLoading: getUserIsLoading
    } = useGetUserQuery(userId, { skip: !isUpdating });
    const user = getUserData?.user;

    if (getUserIsLoading) {
        return (
            <Loader
                className='min-h-svh'
            />
        );
    }

    return (
        <NewUserForm
            user={user}
        />
    );
}