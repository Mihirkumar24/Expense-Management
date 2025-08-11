import { useSelector } from 'react-redux';
import {
    Navigate,
    Outlet
} from 'react-router';
import { toast } from 'sonner';

export default function Administrator() {
    const {
        user: {
            role
        }
    } = useSelector((state) => state.authentication);

    if (role !== 'administrator') {
        toast.error('You are not authorized.');

        return (
            <Navigate to='/' />
        );
    }

    return (
        <Outlet />
    );
}