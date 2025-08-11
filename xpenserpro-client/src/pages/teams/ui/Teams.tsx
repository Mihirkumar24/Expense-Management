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
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

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

import { useGetAllTeamsQuery } from '../../../entities/team/api/teamApi';

type Team = {
    department: {
        head: {
            firstName: String,
            lastName: String
        }
    },
    head: {
        firstName: String,
        lastName: String
    },
    name: String,
    membersCount: Number
}

const columnHelper = createColumnHelper<Team>();

const columns = [
    columnHelper.accessor('name', {
        header: (props) => 'Name'
    }),
    columnHelper.accessor((row) => `${row.head.firstName} ${row.head.lastName}`, {
        id: 'head',
        header: (props) => 'Team Head'
    }),
    columnHelper.accessor((row) => `${row.department.head.firstName} ${row.department.head.lastName}`, {
        id: 'department',
        header: (props) => 'Department'
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

function TeamsTable() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allTeamsData,
        isFetching: getAllTeamsIsFetching
    } = useGetAllTeamsQuery(organization._id);
    const teams = allTeamsData?.teams;

    const table = useReactTable({
        columns,
        data: teams,
        getCoreRowModel: getCoreRowModel()
    });

    if (getAllTeamsIsFetching) {
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

    if (!teams.length) {
        return (
            <p
                className='text-center text-muted-foreground'
            >
                You have no teams.
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

export default function Teams() {
    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='text-2xl'
            >
                Teams
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Team
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

            <TeamsTable />
        </div>
    );
}