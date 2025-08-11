import { createColumnHelper } from '@tanstack/react-table';

type Expense = {
    _id: string,
    amount: number,
    businessPurpose: string,
    category: string,
    convertedAmount: number,
    currency: string,
    currencyExchangeRate: number,
    date: string,
    merchant: string,
    paymentMethod: string,
    receipt: {
        public_id: string,
        secure_url: string
    }
    status: string,
}

const columnHelper = createColumnHelper<Expense>();

export default [
    columnHelper.accessor('_id', {}),
    columnHelper.accessor('amount', {}),
    columnHelper.accessor('businessPurpose', {
        header: () => 'Business Purpose',
    }),
    columnHelper.accessor('category', {
        header: () => 'Category',
    }),
    columnHelper.accessor('convertedAmount', {
        header: () => 'Amount',
    }),
    columnHelper.accessor('currency', {}),
    columnHelper.accessor('currencyExchangeRate', {}),
    columnHelper.accessor('date', {
        header: () => 'Date',
    }),
    columnHelper.accessor('merchant', {
        header: () => 'Merchant',
    }),
    columnHelper.accessor('paymentMethod', {
        header: () => 'Payment Method',
    }),
    columnHelper.accessor('receipt', {}),
    columnHelper.accessor('status', {
        header: () => 'Status',
    }),
];