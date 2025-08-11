import { format } from 'date-fns';
import { useNavigate } from 'react-router';

// shadcn/ui

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';

import Loader from '@/widgets/loader';

import AdvanceStatusBadge from '@/features/advance-status-badge';
import UserAvatar from '@/features/user-avatar';

export default function AdvancesTable({
    advances,
    getAllAdvancesIsFetching
}) {
    const navigate = useNavigate();

    if (!advances || getAllAdvancesIsFetching) {
        return (
            <Loader />
        );
    }

    if (!advances.length) {
        return (
            <div
                className='text-center text-muted-foreground'
            >
                You have no advances.
            </div>
        );
    }

    console.log(advances);

    return (
        <div
            className='border rounded-xs'
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Submitter
                        </TableHead>

                        <TableHead>
                            Date
                        </TableHead>

                        <TableHead>
                            Reference Number
                        </TableHead>

                        <TableHead>
                            Amount
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>

                        <TableHead>
                            Report Name
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {advances.map((advance) => (
                        <TableRow
                            key={advance._id}
                            onClick={() => navigate(`/advances/${advance._id}`)}
                        >
                            <TableCell>
                                <div>
                                    <UserAvatar
                                        firstName={advance.submitter.firstName}
                                        lastName={advance.submitter.lastName}
                                    />
                                </div>
                            </TableCell>

                            <TableCell
                                className='text-primary'
                            >
                                {format(advance.date, 'PPP')}
                            </TableCell>

                            <TableCell>
                                {advance.referenceNumber}
                            </TableCell>

                            <TableCell
                                className='text-right'
                            >
                                USD {advance.amount}
                            </TableCell>

                            <TableCell>
                                <AdvanceStatusBadge
                                    status={advance.status}
                                />
                            </TableCell>

                            <TableCell>
                                {advance.report?.name ?? '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}