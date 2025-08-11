import {
    ArrowUpDown,
    Funnel,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router';

// sahdcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

import AccountsTable from './AccountsTable';

export default function Accounts() {
    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='text-2xl'
            >
                Accounts
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Account
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

            <AccountsTable />
        </div>
    );
}