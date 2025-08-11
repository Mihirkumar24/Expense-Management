import { cva } from 'class-variance-authority';
import { Calendar } from 'lucide-react';
import { useEffect } from 'react';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

// shadcn/ui

import { Badge } from '@/shared/ui/badge';

import { clearExpenses } from '@/entities/expense';
import { useAddExpensesToReportMutation } from '@/entities/report';

import Loader from '@/widgets/loader'

function StatusBadge({
    status
}: {
    status: string
}) {
    const statusBadgeVariants = cva('', {
        variants: {
            status: {
                approved: ['bg-emerald-100 text-emerald-700'],
                submitted: ['bg-amber-100 text-amber-700']
            }
        }
    });

    let label = '';

    if (status === 'draft') {
        label = 'Draft';

        return (
            <Badge
                variant='secondary'
            >
                {label}
            </Badge>
        );
    }

    if (status === 'rejected') {
        label = 'Rejected';

        return (
            <Badge
                variant='destructive'
            >
                {label}
            </Badge>
        );
    }

    if (status === 'approved') {
        label = 'Approved';
    }

    if (status === 'submitted') {
        label = 'Awaiting Approval';
    }

    return (
        <Badge
            className={`${statusBadgeVariants({ status })}`}
        >
            {label}
        </Badge>
    );
}

export default function ReportsList({
    disableAddToReport,
    reports,
    reportsTable,
}) {
    const dispatch = useDispatch();

    const { expenseIds } = useSelector((state) => state.expenses);

    const navigate = useNavigate();

    const [
        addExpensesToReport,
        {
            isSuccess: addExpensesToReportIsSuccess
        }
    ] = useAddExpensesToReportMutation();

    function handleAddExpensesToReport(reportId) {
        const body = { expenseIds };

        addExpensesToReport({
            body,
            reportId
        });

        dispatch(clearExpenses());

        navigate(`/reports/${reportId}`);
    }

    useEffect(() => {
        if (addExpensesToReportIsSuccess) {
            toast.success('Expenses added to the report.');
        }
    });

    if (!reports) {
        return (
            <Loader />
        );
    }

    if (reports.length === 0) {
        return (
            <p
                className='text-center text-muted-foreground'
            >
                You have no reports.
            </p>
        );
    }

    return (
        reportsTable.getRowModel().rows.map((row) => (
            <div
                className='flex flex-col gap-3 p-3 rounded-xs shadow-sm hover:cursor-pointer hover:shadow-lg'
                key={row.id}
                onClick={
                    disableAddToReport
                        ? () => navigate(`/reports/${row.getValue('_id')}`)
                        : () => handleAddExpensesToReport(row.getValue('_id'))
                }
            >
                <div
                    className='flex'
                >
                    <div
                        className='flex gap-3'
                    >
                        <p
                            className='font-semibold text-primary'
                        >
                            {row.getValue('name')}
                        </p>

                        <p
                            className='font-semibold'
                        >
                            #RID
                        </p>

                        <StatusBadge
                            status={row.getValue('status')}
                        />
                    </div>

                    <p
                        className='font-semibold ml-auto'
                    >
                        {row.getValue('amount')} USD
                    </p>
                </div>

                <div>
                    <p>
                        {row.getValue('businessPurpose')}
                    </p>
                </div>

                <div
                    className='flex gap-3'
                >
                    <Calendar />

                    <p>
                        {row.getValue('date.from').slice(0, 10)} - {row.getValue('date.to').slice(0, 10)}
                    </p>
                </div>
            </div>
        ))
    );
}