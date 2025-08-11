import { cva } from 'class-variance-authority';
import _ from 'lodash';
import {
    Calendar,
    Ellipsis,
    Trash
} from 'lucide-react';
import {
    useDispatch,
    useSelector
} from 'react-redux';

// shadcn/ui

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

import {
    addExpense,
    removeExpense,
    useDeleteExpenseMutation
} from '@/entities/expense';
import ExpenseCategories from '@/entities/expense-categories';
import PaymentMethods from '@/entities/payment-methods';
import { useRemoveExpenseFromReportMutation } from '@/entities/report';

import Loader from '@/widgets/loader';

function StatusBadge({
    status
}: {
    status: string
}) {
    const statusBadgeVariants = cva('', {
        variants: {
            status: {
                approved: ['bg-emerald-100 text-emerald-700'],
                submitted: ['bg-amber-100 text-amber-700'],
                unreported: ['bg-sky-100 text-sky-700']
            }
        }
    });

    let label = '';

    if (status === 'reported') {
        label = 'Reported';

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

    if (status === 'unreported') {
        label = 'Unreported';
    }

    return (
        <Badge
            className={`${statusBadgeVariants({ status })}`}
        >
            {label}
        </Badge>
    );
}

export default function ExpensesList({
    displayCheckbox,
    displayDelete,
    displayDropdownMenu,
    displayRemove,
    displayStatus,
    expenses,
    expensesTable,
    reportId
}) {
    const dispatch = useDispatch();

    const { expenseIds } = useSelector((state) => state.expenses);

    const [deleteExpenseMutation] = useDeleteExpenseMutation();

    const [removeExpenseFromReport] = useRemoveExpenseFromReportMutation();

    if (!expenses) {
        return (
            <Loader />
        )
    }

    if (expenses.length === 0) {
        return (
            <p
                className='text-center text-muted-foreground'
            >
                You have no expenses.
            </p>
        )
    }

    function handleRemoveExpenseFromReport(expenseId) {
        const body = { expenseId };

        removeExpenseFromReport({
            body,
            reportId
        })
    }

    function handleSelectExpense(checked, expenseId) {
        if (checked) {
            dispatch(addExpense(expenseId));
        } else {
            dispatch(removeExpense(expenseId));;
        }
    }

    return (
        <div
            className='space-y-6'
        >
            {expensesTable.getRowModel().rows.map((row) => (
                <div
                    className='flex gap-6 p-3 shadow-sm rounded-xs hover:shadow-lg'
                    key={row.id}
                >
                    {displayCheckbox && (
                        <Checkbox
                            checked={expenseIds.includes(row.getValue('_id'))}
                            disabled={row.getValue('status') !== 'unreported'}
                            onCheckedChange={(checked) => handleSelectExpense(checked, row.getValue('_id'))}
                        />
                    )}

                    <div
                        className='border size-24'
                    >
                        <img
                            className='object-cover size-full'
                            src={row.getValue('receipt')?.secure_url}
                        />
                    </div>

                    <div
                        className='grow space-y-3'
                    >
                        <div
                            className='flex justify-between'
                        >
                            <div
                                className='flex gap-3'
                            >
                                <p
                                    className='font-semibold text-primary'
                                >
                                    {row.getValue('businessPurpose')}
                                </p>

                                <p
                                    className='font-semibold text-muted-foreground'
                                >
                                    {'#EID'}
                                </p>

                                {displayStatus && (
                                    <StatusBadge
                                        status={row.getValue('status')}
                                    />
                                )}
                            </div>
                        </div>

                        <div
                            className='flex gap-3'
                        >
                            <div
                                className='flex gap-3'
                            >
                                {ExpenseCategories[`${row.getValue('category')}`]}

                                <p>
                                    {row.getValue('category')}
                                </p>
                            </div>

                            <div>
                                <p>
                                    {row.getValue('merchant')}
                                </p>
                            </div>

                            <div
                                className='flex gap-3'
                            >
                                {PaymentMethods[`${row.getValue('paymentMethod')}`]}

                                <p>
                                    {row.getValue('paymentMethod')}
                                </p>
                            </div>
                        </div>

                        <div
                            className='flex gap-3'
                        >
                            <Calendar />

                            <p>
                                {row.getValue('date').slice(0, 10)}
                            </p>
                        </div>
                    </div>

                    <div
                        className='flex gap-3'
                    >
                        <div>
                            <p
                                className='font-semibold'
                            >
                                {row.getValue('amount')} {row.getValue('currency').toUpperCase()}
                            </p>

                            <p
                                className='text-sm'
                            >
                                {`1 ${row.getValue('currency').toUpperCase()} = ${row.getValue('currencyExchangeRate')} USD`}
                            </p>
                        </div>
                    </div>

                    <p
                        className='font-semibold'
                    >
                        {row.getValue('convertedAmount')} USD
                    </p>

                    {displayDropdownMenu && (
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                asChild
                            >
                                <Button
                                    size='icon'
                                    variant='outline'
                                >
                                    <Ellipsis />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                {displayDelete && (
                                    <DropdownMenuItem
                                        className='text-destructive focus:text-destructive'
                                        onClick={() => deleteExpenseMutation(row.getValue('_id'))}
                                    >
                                        Delete

                                        <DropdownMenuShortcut>
                                            <Trash
                                                className='text-destructive focus:text-destructive'
                                            />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )}

                                {displayRemove && (
                                    <DropdownMenuItem
                                        className='text-destructive focus:text-destructive'
                                        onClick={() => handleRemoveExpenseFromReport(row.getValue('_id'))}
                                    >
                                        Remove

                                        <DropdownMenuShortcut>
                                            <Trash
                                                className='text-destructive focus:text-destructive'
                                            />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            ))}
        </div>
    );
}
