import { format } from 'date-fns';
import {
    CircleAlert,
    LoaderCircle,
    MessageCircleMore,
    Pencil,
    Trash,
    User
} from 'lucide-react';
import {
    useEffect,
    useState
} from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

// shadcn/ui

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/shared/ui/tabs';

import {
    useApproveReportMutation,
    useGetReportQuery,
    useSubmitReportMutation,
} from '@/entities/report';

import ReportStatusBadge from '@/features/report-status-badge';

import { cn } from '@/shared/lib/utils';

import Loader from '@/widgets/loader';
import LoadingButton from '@/widgets/button-loading';

import Advances from './Advances';
import Comments from './Comments';
import Delegate from './Delegate';
import RejectReportDialog from './RejectReportDialog';
import Expenses from './Expenses';
import ApprovalFlow from './ApprovalFlow';
import UserAvatar from '@/features/user-avatar';

export default function Report() {
    const [displayComments, setDisplayComments] = useState(false);

    const { user } = useSelector((state) => state.authentication);

    const { reportId } = useParams();

    const { data: reportData } = useGetReportQuery(reportId);
    const report = reportData?.report;

    const [
        approveReport,
        {
            isLoading: approveReportIsLoading,
            isSuccess: approveReportIsSuccess
        }
    ] = useApproveReportMutation();

    const [
        submitReport,
        {
            error: submitReportError,
            isError: submitReportIsError,
            isLoading: submitReportIsLoading,
            isSuccess: submitReportIsSuccess
        }
    ] = useSubmitReportMutation();

    useEffect(() => {
        if (approveReportIsSuccess) {
            toast.success('Report has been approved.')
        }

        if (submitReportIsError) {
            const {
                data: {
                    message
                }
            } = submitReportError;

            toast.error(message);
        }

        if (submitReportIsSuccess) {
            toast.success('Report has been submitted.')
        }
    }, [
        approveReportIsSuccess,
        submitReportIsError,
        submitReportIsSuccess
    ]);

    if (!report) {
        return (
            <Loader />
        );
    }

    return (
        <div
            className='p-6 space-y-6'
        >
            <div
                className='flex gap-3'
            >
                <UserAvatar
                    firstName={report.submitter.firstName}
                    lastName={report.submitter.lastName}
                />

                <div
                    className='font-medium text-2xl'
                >
                    #RID
                </div>

                <div>
                    <ReportStatusBadge
                        status={report.status}
                    />
                </div>

                <Button
                    className='ml-auto'
                    size='icon'
                    variant='outline'
                >
                    <Pencil />
                </Button>

                {report.status === 'submitted' && report.approvalFlow[report.approvalFlowLevel]._id === user._id && (
                    <>
                        <LoadingButton
                            loading={approveReportIsLoading}
                            onClick={() => approveReport(report._id)}
                        >
                            Approve
                        </LoadingButton>


                        <RejectReportDialog
                            reportId={report._id}
                        />

                        <Delegate
                            approver={report.approver._id}
                        />
                    </>
                )}


                <Button
                    size='icon'
                    variant='outline'
                >
                    <Trash
                        className='text-destructive'
                    />
                </Button>
            </div>

            <Separator />

            <div
                className='gap-3 grid grid-cols-[1fr_1fr_1fr_auto]'
            >
                <div>
                    <div
                        className='text-xl'
                    >
                        {report.name}
                    </div>

                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Date: {format(report.date.from, 'PPP')} - {format(report.date.to, 'PPP')}
                    </div>
                </div>

                <div>
                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Total
                    </div>

                    <div
                        className='font-semibold'
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
                        className={cn('font-semibold', report.reimbursableAmount < 0 && 'text-destructive')}
                    >
                        USD {report.reimbursableAmount}
                    </div>
                </div>

                {(user._id === report.submitter._id || user._id === report.approver._id) && (
                    <Button
                        onClick={() => setDisplayComments(!displayComments)}
                        size='icon'
                        variant='outline'
                    >
                        <MessageCircleMore />
                    </Button>
                )}

                <div>
                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Approver
                    </div>

                    {report.status === 'submitted' ? (
                        <div
                            className='flex gap-3 items-center'
                        >
                            <UserAvatar
                                firstName={report.approver.firstName}
                                lastName={report.approver.lastName}
                            />

                            <ApprovalFlow
                                approvalFlow={report.approvalFlow}
                                approvalFlowLevel={report.approvalFlowLevel}
                            />
                        </div>
                    ) : (
                        <div
                            className='text-muted-foreground'
                        >
                            -
                        </div>
                    )}
                </div>

                <div>
                    <div
                        className='text-sm text-muted-foreground'
                    >
                        Business Purpose
                    </div>

                    <div
                        className='font-medium'
                    >
                        {report.businessPurpose}
                    </div>
                </div>
            </div>

            {displayComments && (
                <Comments
                    comments={report.comments}
                />
            )}

            {report.status === 'rejected' && (
                <Alert
                    variant='destructive'
                >
                    <CircleAlert />

                    <AlertTitle>
                        Rejected
                    </AlertTitle>

                    <AlertDescription>
                        {report.rejectReason}
                    </AlertDescription>
                </Alert>
            )}

            <Tabs
                defaultValue='expenses'
            >
                <TabsList>
                    <TabsTrigger
                        value='expenses'>
                        Expenses
                    </TabsTrigger>

                    <TabsTrigger
                        value='advances'
                    >
                        Advances
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value='expenses'
                >
                    <Expenses
                        expenses={report.expenses}
                    />
                </TabsContent>

                <TabsContent
                    value='advances'
                >
                    <Advances
                        advances={report.advances}
                    />
                </TabsContent>
            </Tabs>

            {(report.status === 'draft' && report.expenses.length !== 0) && (
                <Button
                    disabled={submitReportIsLoading}
                    onClick={() => submitReport(report._id)}
                >
                    {submitReportIsLoading && (
                        <LoaderCircle
                            className='animate-spin'
                        />
                    )}

                    Submit
                </Button>
            )}
        </div >
    );
}