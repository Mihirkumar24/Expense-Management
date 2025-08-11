import { format } from 'date-fns';
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

export default function InvoiceRecordingTable({
    accountsPayable,
    getAllAccountsPayableIsFetching
}) {
    const navigate = useNavigate();

    if (!accountsPayable || getAllAccountsPayableIsFetching) {
        return (
            <Loader />
        );
    }

    if (!accountsPayable.length) {
        return (
            <div
                className='text-center text-muted-foreground'
            >
                You have no recorded invoices.
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
                            Transaction Date
                        </TableHead>

                        <TableHead>
                            Transaction Type
                        </TableHead>

                        <TableHead>
                            Invoice Date
                        </TableHead>

                        <TableHead>
                            Company
                        </TableHead>

                        <TableHead>
                            Main Account
                        </TableHead>

                        <TableHead>
                            Description
                        </TableHead>

                        <TableHead>
                            Debit
                        </TableHead>

                        <TableHead>
                            Credit
                        </TableHead>

                        <TableHead>
                            Offset Account
                        </TableHead>

                        <TableHead>
                            Method of Payment
                        </TableHead>

                        <TableHead>
                            Terms of Payment
                        </TableHead>

                        <TableHead>
                            Due Date
                        </TableHead>

                        <TableHead>
                            Exchange Rate
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {accountsPayable.map((accountPayable) => (
                        <TableRow
                            key={accountPayable._id}
                        // onClick={() => navigate(`/accountPayables/${budget._id}`)}
                        >
                            <TableCell>
                                {format(accountPayable.transactionDate, 'PPP')}
                            </TableCell>

                            <TableCell>
                                {accountPayable.transactionType}
                            </TableCell>

                            <TableCell>
                                {format(accountPayable.invoiceDate, 'PPP')}
                            </TableCell>

                            <TableCell>
                                {accountPayable.company}
                            </TableCell>

                            <TableCell>
                                {accountPayable.mainAccount}
                            </TableCell>

                            <TableCell>
                                {accountPayable.description}
                            </TableCell>

                            <TableCell>
                                USD {accountPayable.debit}
                            </TableCell>

                            <TableCell>
                                USD {accountPayable.credit}
                            </TableCell>

                            <TableCell>
                                {accountPayable.offsetAccount}
                            </TableCell>

                            <TableCell>
                                {accountPayable.methodOfPayment}
                            </TableCell>

                            <TableCell>
                                {accountPayable.termsOfPayment}
                            </TableCell>

                            <TableCell>
                                {format(accountPayable.dueDate, 'PPP')}
                            </TableCell>

                            <TableCell>
                                {accountPayable.exchangeRate}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}