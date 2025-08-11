import { Button } from '@/shared/ui/button';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

export default function Expenses({
    expenses
}) {
    if (!expenses.length) {
        return (
            <div
                className='text-center text-muted-foreground'
            >
                You have no expenses.
            </div>
        );
    }

    return (
        <div
            className='space-y-6'
        >
            {expenses.map((expense) => (
                <div
                    className='border gap-3 grid grid-cols-[auto_auto_1fr_1fr_auto] rounded-xs p-6 hover:shadow-sm hover:cursor-pointer'
                    key={expense._id}
                >
                    <div
                        className='border border-dashed size-24'
                    >

                    </div>

                    <div
                        className='space-y-1.5'
                    >
                        <div
                            className='flex gap-3'
                        >
                            <div
                                className='text-sm'
                            >
                                {format(expense.date, 'PPP')}
                            </div>

                            <div
                                className='text-sm'
                            >
                                {expense.merchant}
                            </div>
                        </div>

                        <div
                            className='text-primary text-sm'
                        >
                            {expense.category}
                        </div>

                        <div
                            className='italic text-muted-foreground text-sm'
                        >
                            {expense.description}
                        </div>
                    </div>

                    {expense.currency !== 'usd' || true && (
                        <div>
                            <div
                                className='font-semibold text-right'
                            >
                                {expense.currency.toUpperCase()} {expense.amount}
                            </div>

                            <div
                                className='text-right text-xs'
                            >
                                {expense.currency.toUpperCase()} 1 = USD {expense.currencyExchangeRate}
                            </div>
                        </div>
                    )}

                    <div>
                        <div
                            className='font-semibold text-right'
                        >
                            {expense.currency.toUpperCase()} {expense.amount}
                        </div>
                    </div>

                    <div>
                        <Button
                            size='icon'
                            variant='ghost'
                        >
                            <MoreHorizontal />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}