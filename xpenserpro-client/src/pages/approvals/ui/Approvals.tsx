import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table';

import { Funnel } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
    useNavigate,
    useSearchParams
} from 'react-router';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/shared/ui/tabs';

import { useLazyGetAllAdvancesQuery } from '@/entities/advance';
import { useGetAllReportsQuery } from '@/entities/report';

import ReportsList from '@/features/reports-list';
import Sort from '@/features/sort';

import { reportsTableColumns } from '@/pages/reports';

import AdvancesTable from './AdvancesTable';

function Toolbar({
    reportsTable
}) {
    const navigate = useNavigate();

    return (
        <div
            className='flex flex-row-reverse gap-3'
        >
            <Sort
                table={reportsTable}
            />

            <Button
                size='icon'
                variant='outline'
            >
                <Funnel />
            </Button>
        </div >
    );
}

export default function Reports() {
    const [searchParams, setSearchParams] = useSearchParams('?tab=reports');
    const tab = searchParams.get('tab');

    const {
        user
    } = useSelector((state) => state.authentication);

    const [
        getAllAdvances,
        {
            data: allAdvancesData,
            isFetching: getAllAdvancesIsFetching
        }
    ] = useLazyGetAllAdvancesQuery();
    const advances = allAdvancesData?.advances;

    const {
        data: allReportsData
    } = useGetAllReportsQuery({
        role: 'approver',
        status: 'all'
    });
    const reports = allReportsData?.reports;

    const navigate = useNavigate();

    const reportsTable = useReactTable({
        columns: reportsTableColumns,
        data: reports,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnVisibility: {
                _id: false
            }
        }
    });

    return (
        <div
            className='p-6'
        >
            <Tabs
                className='space-y-6'
                onValueChange={(value) => {
                    if (value === 'advances') {
                        getAllAdvances(
                            {
                                role: 'approver',
                                status: 'all'
                            },
                            true
                        );
                    }
                }}
                defaultValue={tab}
            >
                <TabsList>
                    <TabsTrigger
                        value='reports'
                    >
                        Reports
                    </TabsTrigger>

                    <TabsTrigger
                        value='advances'
                    >
                        Advances
                    </TabsTrigger>
                </TabsList>

                <Separator />

                <TabsContent
                    value='reports'
                >
                    <ReportsList
                        disableAddToReport={true}
                        reportsTable={reportsTable}
                        reports={reports}
                    />
                </TabsContent>

                <TabsContent
                    value='advances'
                >
                    <AdvancesTable
                        advances={advances}
                        getAllAdvancesIsFetching={getAllAdvancesIsFetching}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}