import {
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';

import { useSelector } from 'react-redux';

// shadcn/ui

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/ui/table';

import { useGetAllAccountsQuery } from '@/entities/account';

import Loader from '@/widgets/loader';

import columns from '../model/accountsTableColumns';

export default function AccountsTable() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allAccountsData,
        isLoading: getAllAccountsIsLoading
    } = useGetAllAccountsQuery(organization._id);
    const accounts = allAccountsData?.accounts;

    const table = useReactTable({
        columns,
        data: accounts,
        getCoreRowModel: getCoreRowModel()
    });

    if (getAllAccountsIsLoading) {
        return (
            <Loader />
        );
    }

    if (!accounts.length) {
        return (
            <p
                className='text-center text-muted-foreground'
            >
                You have no account.
            </p>
        );
    }

    return (
        <div
            className='border rounded-xs'
        >
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}