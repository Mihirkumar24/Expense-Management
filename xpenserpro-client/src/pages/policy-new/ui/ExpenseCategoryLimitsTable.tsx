import {
    useFormContext,
    useWatch
} from 'react-hook-form';


// shadcn/ui

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';

import ExpenseCategoryLimitDialog from './ExpenseCategoryLimitDialog';

export default function ExpenseCategoryLimitsTable() {
    const newPolicyForm = useFormContext();

    const expenseCategories = useWatch({
        control: newPolicyForm.control,
        name: 'expenseCategories'
    });

    return (
        <div
            className='border rounded-xs'
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Expense Category
                        </TableHead>

                        <TableHead>
                            Expense Amount Limit
                        </TableHead>

                        <TableHead>

                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {expenseCategories.map((expenseCategory, index) => (
                        <TableRow
                            key={index}
                        >
                            <TableCell
                                className='text-primary'
                            >
                                {expenseCategory.expenseCategory}
                            </TableCell>

                            <TableCell>
                                {
                                    expenseCategory.expenseCategoryLimit === -1
                                        ? '-'
                                        : expenseCategory.expenseCategoryLimit
                                }
                            </TableCell>

                            <TableCell>
                                <ExpenseCategoryLimitDialog
                                    expenseCategory={expenseCategory.expenseCategory}
                                    index={index}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}