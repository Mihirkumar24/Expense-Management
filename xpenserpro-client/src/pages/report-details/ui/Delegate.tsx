import { useSelector } from 'react-redux';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { useDelegateReportMutation } from '@/entities/report';
import { useGetAllUsersQuery } from '@/entities/user';

import Loader from '@/widgets/loader';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { LoaderCircle } from 'lucide-react';

export default function Delegate({
    approver
}) {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        delegateReport,
        {
            isLoading: delegateReportIsLoading,
            isSuccess: delegateReportIsSuccess
        }
    ] = useDelegateReportMutation();

    const {
        data: getAllUsersData
    } = useGetAllUsersQuery({
        organization: organization._id,
        roles: ['administrator', 'approver']
    });
    const delegates = getAllUsersData?.users;

    const { reportId } = useParams();

    function handleDelgateReport(delegateId) {
        const body = {
            delegate: delegateId
        }

        delegateReport({
            body,
            reportId
        });
    }

    useEffect(() => {
        if (delegateReportIsSuccess) {
            toast.success('Report is delegated.');
        }
    }, [delegateReportIsSuccess]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    disabled={delegateReportIsLoading}
                    variant='outline'
                >
                    {delegateReportIsLoading && (
                        <LoaderCircle
                            className='animate-spin'
                        />
                    )}

                    Delegate
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {delegates ? delegates.map((delegate, index) => (
                    delegate._id !== approver && (
                        < DropdownMenuItem
                            onSelect={(event) => handleDelgateReport(delegate._id)}
                        >
                            {delegate.firstName} {delegate.lastName}
                        </DropdownMenuItem>
                    )
                )) : (
                    <Loader />
                )}
            </DropdownMenuContent>
        </DropdownMenu >
    );
}