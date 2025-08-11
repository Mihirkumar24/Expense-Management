import {
    Pencil,
    Trash
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

// shadcn/ui

import { Button } from '@/shared/ui/button';

import {
    useApproveAdvanceMutation,
    useGetAdvanceQuery,
    useRejectAdvanceMutation
} from '@/entities/advance';

import AdvanceStatusBadge from '@/features/advance-status-badge';

import Loader from '@/widgets/loader';
import LoadingButton from '@/widgets/button-loading/ui/LoadingButton';

export default function Advance() {
    const {
        user
    } = useSelector((state) => state.authentication);

    const { advanceId } = useParams();

    const [
        approveAdvance,
        {
            isLoading: approveAdvanceIsLoading,
            isSuccess: approveAdvanceIsSuccess
        }
    ] = useApproveAdvanceMutation();

    const [
        rejectAdvance,
        {
            isLoading: rejectAdvanceIsLoading,
            isSuccess: rejectAdvanceIsSuccess
        }
    ] = useRejectAdvanceMutation();

    const { data: advanceData } = useGetAdvanceQuery(advanceId);
    const advance = advanceData?.advance;

    if (!advance) {
        return (
            <Loader
                className='h-full'
            />
        );
    }

    return (
        <div
            className='p-6 space-y-6'
        >
            <div
                className='flex'
            >
                <div
                    className='flex gap-3'
                >
                    <div
                        className='font-semibold'
                    >
                        {advance.date.slice(0, 10)}
                    </div>

                    <div>
                        <AdvanceStatusBadge
                            status={advance.status}
                        />
                    </div>
                </div>

                <div
                    className='flex gap-3 ml-auto'
                >
                    {advance.submitter === user._id && (
                        <>
                            <Button
                                size='icon'
                                variant='outline'
                            >
                                <Pencil />
                            </Button>

                            <Button
                                size='icon'
                                variant='outline'
                            >
                                <Trash
                                    className='text-destructive'
                                />
                            </Button>
                        </>
                    )}

                    {advance.status === 'submitted' && advance.approver === user._id && (
                        <>
                            <LoadingButton
                                loading={approveAdvanceIsLoading}
                                onClick={() => approveAdvance(advanceId)}
                            >
                                Approve
                            </LoadingButton>

                            <LoadingButton
                                loading={rejectAdvanceIsLoading}
                                variant='destructive'
                            >
                                Reject
                            </LoadingButton>
                        </>
                    )}
                </div>
            </div>

            <div
                className='grid grid-cols-3 border rounded-xs'
            >
                <div
                    className='bg-muted flex'
                >
                    <div
                        className='m-auto'
                    >
                        <div
                            className='text-center text-muted-foreground text-sm'
                        >
                            Amount
                        </div>

                        <div
                            className='font-medium text-2xl text-center'
                        >
                            {advance.currency.toUpperCase()} {advance.amount}
                        </div>

                        <div
                            className='text-center text-muted-foreground text-sm'
                        >
                            Amount in USD: USD {advance.amount}
                        </div>

                        <div
                            className='text-center text-muted-foreground text-sm'
                        >
                            ({advance.currency.toUpperCase()} 1 = USD {advance.currencyExchangeRate})
                        </div>
                    </div>
                </div>

                <div
                    className='col-span-2 grid grid-cols-2 max-w-sm px-3 py-6 space-y-3'
                >
                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Date:
                    </div>

                    <div>
                        {advance.date.slice(0, 10)}
                    </div>

                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Account:
                    </div>

                    <div>
                        {advance.account.name}
                    </div>

                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Business Purpose:
                    </div>

                    <div>
                        {advance.businessPurpose}
                    </div>

                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Expense Category:
                    </div>

                    <div>
                        {advance.expenseCategory}
                    </div>

                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Description:
                    </div>

                    <div>
                        {advance.description ?? '-'}
                    </div>

                    <div
                        className='text-muted-foreground text-sm'
                    >
                        Reference Number:
                    </div>

                    <div>
                        {advance.referenceNumber}
                    </div>
                </div>
            </div>
        </div >
    );
}