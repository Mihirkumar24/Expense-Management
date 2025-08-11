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
import { format } from 'date-fns';
import ReportStatusBadge from '@/features/report-status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import UserAvatar from '@/features/user-avatar';

export default function ReportsTable({
    reports
}) {
    const navigate = useNavigate();

    if (!reports) {
        return (
            <Loader />
        );
    }

    if (!reports.length) {
        return (
            <div
                className='text-center text-muted-foreground'
            >
                You have no reports.
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
                            Report Number
                        </TableHead>

                        <TableHead>
                            Report Name
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>

                        <TableHead>
                            Approver
                        </TableHead>

                        <TableHead
                            className='text-right'
                        >
                            Total
                        </TableHead>

                        <TableHead
                            className='text-right'
                        >
                            To be Reimbursed
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {reports.map((report) => (
                        <TableRow
                            key={report._id}
                            onClick={() => navigate(`/reports/${report._id}`)}
                        >
                            <TableCell>
                                {report._id}
                            </TableCell>

                            <TableCell>
                                <div>
                                    <div>
                                        {report.name}
                                    </div>

                                    <div
                                        className='text-muted-foreground text-xs'
                                    >
                                        {format(report.date.from, 'PPP')} - {format(report.date.to, 'PPP')}
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <ReportStatusBadge
                                    status={report.status}
                                />
                            </TableCell>

                            <TableCell>
                                {report.approver ? (
                                    <UserAvatar
                                        firstName={report.approver.firstName}
                                        lastName={report.approver.lastName}
                                    />
                                ) : (
                                    <div
                                        className='text-muted-foreground'
                                    >
                                        -
                                    </div>
                                )}
                            </TableCell>

                            <TableCell
                                className='text-right'
                            >
                                USD {report.amount}
                            </TableCell>

                            <TableCell
                                className='text-right'
                            >
                                USD {report.reimbursableAmount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}