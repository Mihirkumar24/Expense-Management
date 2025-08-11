import {
    ArrowDownNarrowWide,
    ArrowUpDown,
    ArrowUpNarrowWide
} from 'lucide-react';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { flexRender } from '@tanstack/react-table';

export default function Sort({
    table
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
            >
                <Button
                    size='icon'
                    variant='outline'
                >
                    <ArrowUpDown />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Sort by
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {table.getHeaderGroups().map((headerGroup) => (
                        headerGroup.headers.map((header) => (
                            <DropdownMenuItem
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                <DropdownMenuShortcut>
                                    {{
                                        asc: <ArrowDownNarrowWide />,
                                        desc: <ArrowUpNarrowWide />,
                                    }[header.column.getIsSorted() as string] ?? null}
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}