import { createColumnHelper } from '@tanstack/react-table';

import _ from 'lodash';
import { Ellipsis } from 'lucide-react';

// shadcn/ui

import { Button } from '@/shared/ui/button';

type Account = {
    accountNumber: String,
    code: String,
    name: String,
    type: String
}

const columnHelper = createColumnHelper<Account>();

export default [
    columnHelper.accessor('name', {
        header: () => 'Name'
    }),
    columnHelper.accessor('code', {
        header: () => 'Code'
    }),
    columnHelper.accessor('type', {
        header: () => 'Type',
        cell: (info) => _.capitalize(info.getValue())
    }),
    columnHelper.accessor('accountNumber', {
        header: () => 'Account Number',
        cell: (info) => info.getValue() ?? <p className='text-muted-foreground'>-</p>
    }),
    columnHelper.display({
        id: 'actions',
        cell: () => (
            <Button
                variant='ghost'
            >
                <Ellipsis />
            </Button>
        )
    })
]