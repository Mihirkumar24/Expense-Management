import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';
import {
    ArrowDownNarrowWide,
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

import { useGetAllProjectsQuery } from '@/entities/project';

type Project = {
    head: {
        firstName: String,
        lastName: String
    }
    name: String
}

const columnHelper = createColumnHelper<Project>();

const columns = [
    columnHelper.accessor('name', {
        header: (props) => 'Name'
    }),
    columnHelper.accessor((row) => `${row.head.firstName} ${row.head.lastName}`, {
        id: 'head',
        header: (props) => 'Project Head'
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

function ProjectsTable() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allProjectsData,
        isFetching: getAllProjectsIsFetching
    } = useGetAllProjectsQuery(organization._id);
    const projects = allProjectsData?.projects;

    const table = useReactTable({
        columns,
        data: projects,
        getCoreRowModel: getCoreRowModel()
    });

    if (getAllProjectsIsFetching) {
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

    if (!projects.length) {
        return (
            <p
                className='text-center text-muted-foreground'
            >
                You have no projects.
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

export default function Projects() {
    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='text-2xl'
            >
                Projects
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Project
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

            <ProjectsTable />
        </div>
    );
}