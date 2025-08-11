import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';

import _ from 'lodash';
import {
    ArrowUpDown,
    Ellipsis,
    Funnel,
    Pencil,
    Plus,
    Trash
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/shared/ui/table';

import { useGetAllUsersQuery } from '@/entities/user';
import Loader from '@/widgets/loader';
import { Badge } from '@/shared/ui/badge';

type User = {
    _id: string,
    firstName: string,
    lastName: string,
    approver: {
        firstName: string,
        lastName: string
    },
    level: number,
    role: string,
    status: string
}

const columnHelper = createColumnHelper<User>();

const columns = [
    columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: 'name',
        header: (props) => 'Name',
        cell: ({ getValue, row }) => {
            const name = getValue();
            const status = row.original.status;

            return (
                <div
                    className='flex gap-3'
                >
                    {name}

                    {status === 'invited' && (
                        <Badge
                            className='bg-amber-500/25 text-amber-700'
                        >
                            {_.capitalize(status)}
                        </Badge>
                    )}
                </div>
            );
        }
    }),
    columnHelper.accessor((row) => row.approver ? `${row.approver.firstName} ${row.approver.lastName}` : '-', {
        id: 'approver',
        header: (props) => 'Approver'
    }),
    columnHelper.accessor('status', {}),
    columnHelper.accessor('level', {
        header: (props) => 'Level'
    }),
    columnHelper.accessor('role', {
        cell: (props) => (
            <RoleBadge
                role={props}
            />
        ),
        header: (props) => 'Role'
    }),
    columnHelper.display({
        id: 'actions',
        cell: (props) => (
            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                >
                    <Button
                        size='icon'
                        variant='ghost'
                    >
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <Link
                            to={`${props.row.original._id}`}
                        >
                            <DropdownMenuItem>
                                Edit

                                <DropdownMenuShortcut>
                                    <Pencil />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>

                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Delete

                            <DropdownMenuShortcut>
                                <Trash />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu >
        )
    })
];

function RoleBadge({
    role
}) {
    return (
        <Badge
            variant='outline'
        >
            {_.capitalize(role.getValue())}
        </Badge>
    )
}

function UsersTable() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allUsersData
    } = useGetAllUsersQuery({
        organization: organization._id,
        roles: ['administrator', 'approver', 'submitter'],
        status: 'all'
    });
    const users = allUsersData?.users;

    const table = useReactTable({
        columns,
        data: users,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnVisibility: {
                status: false
            }
        }
    });

    if (!users) {
        return (
            <Loader />
        );
    }

    if (users.length === 0) {
        return (
            <p
                className='text-center text-muted-foreground'
            >
                You have no users.
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

export default function Users() {
    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='text-2xl'
            >
                Users
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New User
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

            <UsersTable />
        </div>
    );
}