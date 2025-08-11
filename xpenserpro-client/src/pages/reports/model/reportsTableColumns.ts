import { createColumnHelper } from '@tanstack/react-table';

type Expense = {
    _id: string,
    amount: number,
    businessPurpose: string,
    date: {
        from: string,
        to: string
    },
    name: string,
    status: string,
}

const columnHelper = createColumnHelper<Expense>();

export default [
    columnHelper.accessor('_id', {}),
    columnHelper.accessor('amount', {
        header: () => 'Amount',
    }),
    columnHelper.accessor('businessPurpose', {
        header: () => 'Business Purpose',
    }),
    columnHelper.accessor((row) => row.date.from, {
        id: 'date.from',
        header: () => 'Date (from)',
    }),
    columnHelper.accessor((row) => row.date.to, {
        id: 'date.to',
        header: () => 'Date (to)',
    }),
    columnHelper.accessor('name', {
        header: () => 'Name',
    }),
    columnHelper.accessor('status', {
        header: () => 'Status',
    }),
];