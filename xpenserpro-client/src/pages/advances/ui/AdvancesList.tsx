import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

// shadcn/ui

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

import {
    useApplyAdvanceToReportMutation,
    useLazyGetAllReportsQuery
} from '@/entities/report';

import LoadingButton from '@/widgets/button-loading';
import Loader from '@/widgets/loader';

import AdvanceStatusBadge from '@/features/advance-status-badge';

export default function AdvancesList({
    advances,
    getAllAdvancesIsFetching
}) {
    const [
        applyAdvanceToReport,
        {
            isLoading: applyAdvanceToReportIsLoading,
            isSuccess: applyAdvanceToReportIsSuccess
        }
    ] = useApplyAdvanceToReportMutation();

    const [
        getAllReports,
        {
            data: allReportsData
        }
    ] = useLazyGetAllReportsQuery();
    const reports = allReportsData?.reports;

    const navigate = useNavigate();

    function handleApplyAdvanceToReport(event: React.MouseEvent, advanceId: string, reportId: string) {
        event.stopPropagation();

        const body = {
            advanceId
        };

        applyAdvanceToReport({
            body,
            reportId
        });
    }

    useEffect(() => {
        if (applyAdvanceToReportIsSuccess) {
            toast.success('Advance has been applied.');
        }
    }, [applyAdvanceToReportIsSuccess]);

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
                You have no pending advances.
            </div>
        );
    }

    return (
        <div
            className='space-y-6'
        >
            {advances.map((advance) => (
                <div
                    className='border grid grid-cols-[repeat(3,_1fr)_auto] p-6 rounded-xs hover:shadow-sm'
                    key={advance._id}
                    onClick={() => navigate(advance._id)}
                >
                    <div>
                        <div
                            className='text-muted-foreground text-sm'
                        >
                            Advance Amount
                        </div>

                        <div
                            className='text-xl'
                        >
                            USD {advance.amount}
                        </div>

                        <div>
                            <AdvanceStatusBadge
                                status={advance.status}
                            />
                        </div>
                    </div>

                    <div>
                        <div>
                            <span className='text-muted-foreground text-sm'>Date:</span> {advance.date.slice(0, 10)}
                        </div>

                        <div>
                            <span className='text-muted-foreground text-sm'>Reference Number:</span> {advance.referenceNumber}
                        </div>
                    </div>

                    <div>
                        <div>
                            <span className='text-muted-foreground text-sm'>Report Number:</span> {advance.report?._id ?? '-'}
                        </div>
                    </div>

                    <DropdownMenu
                        onOpenChange={(open) => {
                            if (open) {
                                getAllReports(
                                    {
                                        role: 'submitter',
                                        status: 'draft'
                                    },
                                    true
                                );
                            }
                        }}
                    >
                        <DropdownMenuTrigger
                            asChild
                        >
                            <LoadingButton
                                loading={applyAdvanceToReportIsLoading}
                                size='sm'
                                variant='outline'
                            >
                                Apply to Report

                                <ChevronRight />
                            </LoadingButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            {reports ? (
                                reports.length ? (
                                    reports.map((report, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={(event) => handleApplyAdvanceToReport(event, advance._id, report._id)}
                                        >
                                            {report.name}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <div
                                        className='text-muted-foreground text-sm p-1.5'
                                    >
                                        NO ITEMS FOUND
                                    </div>
                                )
                            ) : (
                                <Loader />
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
        </div>
    );
}