import {
    Funnel,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/shared/ui/tabs';

import { useGetAllReportsQuery } from '@/entities/report';

import ReportsList from './ReportsList';
import ReportsTable from './ReportsTable';

export default function Reports() {
    const {
        data: allReportsData
    } = useGetAllReportsQuery({
        role: 'submitter',
        status: 'all'
    });
    const reports = allReportsData?.reports;

    const navigate = useNavigate();

    return (
        <div
            className='p-6'
        >
            <Tabs
                className='space-y-6'
                defaultValue='pendingReports'
            >
                <div
                    className='flex'
                >
                    <TabsList>
                        <TabsTrigger
                            value='pendingReports'
                        >
                            Pending Reports
                        </TabsTrigger>

                        <TabsTrigger
                            value='allReports'
                        >
                            All Reports
                        </TabsTrigger>
                    </TabsList>

                    <div
                        className='ml-auto space-x-3'
                    >
                        <Button
                            onClick={() => navigate('new')}
                        >
                            <Plus />

                            New Report
                        </Button>

                        <Button
                            size='icon'
                            variant='outline'
                        >
                            <Funnel />
                        </Button>
                    </div>
                </div>

                <Separator />

                <TabsContent
                    value='pendingReports'
                >
                    <ReportsList
                        reports={reports}
                    />
                </TabsContent>

                <TabsContent
                    value='allReports'
                >
                    <ReportsTable
                        reports={reports}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}