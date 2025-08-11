import {
    ArrowUpDown,
    Funnel,
    Plus
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

// sahdcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

import { useGetAllAccountsPayableQuery } from '@/entities/accounts-payable';

import InvoiceRecordingTable from './InvoiceRecordingTable';

export default function InvoiceRecording() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allAccountsPayableData,
        isFetching: getAllAccountsPayableIsFetching
    } = useGetAllAccountsPayableQuery(organization._id);
    const accountsPayable = allAccountsPayableData?.accountsPayable;

    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='text-2xl'
            >
                Invoice Recording
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Invoice
                </Button>

                <Button
                    size='icon'
                    variant='outline'
                >
                    <ArrowUpDown />
                </Button>

                <Button
                    size='icon'
                    variant='outline'
                >
                    <Funnel />
                </Button>
            </div>

            <InvoiceRecordingTable
                accountsPayable={accountsPayable}
                getAllAccountsPayableIsFetching={getAllAccountsPayableIsFetching}
            />
        </div>
    );
}