import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';

import {
    ArrowUpDown,
    Ellipsis,
    Funnel,
    LoaderCircle,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/ui/table';

import { useGetAllDepartmentsQuery } from '@/entities/department';

type Department = {
    head: {
        firstName: String,
        lastName: String
    },
    membersCount: Number
    name: String,
    teamsCount: Number
}

const columnHelper = createColumnHelper<Department>();

const columns = [
    columnHelper.accessor('name', {
        header: (props) => 'Name'
    }),
    columnHelper.accessor((row) => `${row.head.firstName} ${row.head.lastName}`, {
        id: 'head',
        header: (props) => 'Department Head'
    }),
    columnHelper.accessor('teamsCount', {
        header: (props) => 'Total Teams'
    }),
    columnHelper.accessor('membersCount', {
        header: (props) => 'Total Members'
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => (
            <Button
                variant='ghost'
            >
                <Ellipsis />
            </Button>
        )
    })
];

function DepartmentsTable() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allDepartmentsData,
        isFetching: getAllDepartmentsIsFetching
    } = useGetAllDepartmentsQuery(organization._id);
    const departments = allDepartmentsData?.departments;

    const table = useReactTable({
        columns,
        data: departments,
        getCoreRowModel: getCoreRowModel()
    });

    if (getAllDepartmentsIsFetching) {
        return (
            <div
                className='flex'
            >
                <LoaderCircle
                    className='animate-spin m-auto'
                />
            </div>
        );
    }

    if (!departments.length) {
        return (
            <p
                className='text-center text-muted-foreground'
            >
                You have no departments.
            </p>
        );
    }

    return (
        <div
            className='border rounded-md'
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

export default function Departments() {
    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='text-2xl'
            >
                Departments
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Department
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

            <DepartmentsTable />
        </div>
    );
}