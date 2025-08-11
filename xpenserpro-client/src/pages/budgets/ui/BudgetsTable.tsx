import { useNavigate } from 'react-router';

// shadcn/ui

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';

import Loader from '@/widgets/loader';

export default function BudgetsTable({
    budgets,
    getAllBudgetsIsFetching
}) {
    const navigate = useNavigate();

    if (!budgets || getAllBudgetsIsFetching) {
        return (
            <Loader />
        );
    }

    if (!budgets.length) {
        return (
            <div
                className='text-center text-muted-foreground'
            >
                You have no budget.
            </div>
        );
    }

    return (
        <div
            className='border rounded-xs'
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Date
                        </TableHead>

                        <TableHead>
                            Account
                        </TableHead>

                        <TableHead>
                            Amount
                        </TableHead>

                        <TableHead>
                            Department
                        </TableHead>

                        <TableHead>
                            Expense Category
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {budgets.map((budget) => (
                        <TableRow
                            key={budget._id}
                        // onClick={() => navigate(`/budgets/${budget._id}`)}
                        >
                            <TableCell
                                className='text-primary'
                            >
                                {budget.date.from.slice(0, 10)} - {budget.date.to.slice(0, 10)}
                            </TableCell>

                            <TableCell>
                                {budget.account.name}
                            </TableCell>

                            <TableCell>
                                USD {budget.amount}
                            </TableCell>

                            <TableCell>
                                {budget.department.name}
                            </TableCell>

                            <TableCell>
                                {budget.expenseCategory}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}