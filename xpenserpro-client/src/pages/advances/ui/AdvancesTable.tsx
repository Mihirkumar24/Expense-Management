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

    return (
        <div
            className='border rounded-xs'
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Date
                        </TableHead>

                        <TableHead>
                            Account
                        </TableHead>

                        <TableHead>
                            Amount
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>

                        <TableHead>
                            Report
                        </TableHead>

                        <TableHead>
                            Reference Number
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {advances.map((advance) => (
                        <TableRow
                            key={advance._id}
                            onClick={() => navigate(`/advances/${advance._id}`)}
                        >
                            <TableCell
                                className='text-primary'
                            >
                                {advance.date.slice(0, 10)}
                            </TableCell>

                            <TableCell>
                                {advance.account.name}
                            </TableCell>

                            <TableCell>
                                {advance.amount}
                            </TableCell>

                            <TableCell>
                                <AdvanceStatusBadge
                                    status={advance.status}
                                />
                            </TableCell>

                            <TableCell>
                                {advance.report?.name ?? '-'}
                            </TableCell>

                            <TableCell>
                                {advance.referenceNumber}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}