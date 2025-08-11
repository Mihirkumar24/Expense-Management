import { format } from 'date-fns';
import { useNavigate } from 'react-router';

// shadcn/ui

import { Separator } from '@/shared/ui/separator';

import ReportStatusBadge from '@/features/report-status-badge';
import Loader from '@/widgets/loader';

export default function ReportsList({
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
                You have no pending reports.
            </div>
        );
    }

    return (
        <div
            className='space-y-6'
        >
            {reports.map((report) => (
                <div
                    className='border p-6 rounded-xs space-y-3 hover:shadow-sm hover:cursor-pointer'
                    key={report._id}
                    onClick={() => navigate(report._id)}
                >
                    <div>
                        <div
                            className='text-muted-foreground text-sm'
                        >
                            #RID
                        </div>

                        <div
                            className='flex gap-3'
                        >
                            <div
                                className='text-primary font-medium'
                            >
                                {report.name}
                            </div>

                            <ReportStatusBadge
                                status={report.status}
                            />
                        </div>
                    </div>

                    <Separator />

                    <div
                        className='flex justify-between'
                    >
                        <div>
                            <div
                                className='text-muted-foreground text-sm'
                            >
                                Date
                            </div>

                            <div
                                className='font-medium text-sm'
                            >
                                {format(report.date.from, 'PPP')} - {format(report.date.to, 'PPP')}
                            </div>
                        </div>

                        <div>
                            <div
                                className='text-muted-foreground text-sm'
                            >
                                Expenses
                            </div>

                            <div
                                className='font-medium text-sm'
                            >
                                {report.expenses.length}
                            </div>
                        </div>

                        <div>
                            <div
                                className='text-muted-foreground text-sm'
                            >
                                Total
                            </div>

                            <div
                                className='font-medium'
                            >
                                USD {report.amount}
                            </div>
                        </div>

                        <div>
                            <div
                                className='text-muted-foreground text-sm'
                            >
                                Amount to be Reimbursed
                            </div>

                            <div
                                className='font-medium'
                            >
                                USD {report.reimbursableAmount}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

}