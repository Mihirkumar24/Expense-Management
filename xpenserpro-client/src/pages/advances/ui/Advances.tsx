import {
    ArrowUpDown,
    Funnel,
    Plus
} from 'lucide-react';
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

import AdvancesList from './AdvancesList';
import AdvancesTable from './AdvancesTable';
import { useGetAllAdvancesQuery, useLazyGetAllAdvancesQuery } from '@/entities/advance';
import { useEffect } from 'react';

export default function Advances() {
    const [searchParams, setSearchParams] = useSearchParams('?tab=pendingAdvances&status=approved');
    const tab = searchParams.get('tab');

    const [
        getAllAdvances,
        {
            data: allAdvancesData,
            isFetching: getAllAdvancesIsFetching
        }
    ] = useLazyGetAllAdvancesQuery();
    const advances = allAdvancesData?.advances;

    const navigate = useNavigate();

    useEffect(() => {
        const status = searchParams.get('status');

        const filter = {
            role: 'submitter',
            status
        };

        getAllAdvances(filter);
    }, [searchParams]);

    return (
        <div
            className='p-6'
        >
            <Tabs
                className='space-y-6'
                onValueChange={(value) => {
                    if (value === 'pendingAdvances') {
                        setSearchParams(`?tab=${value}&status=approved`);
                    } else {
                        setSearchParams(`?tab=${value}&status=all`);
                    }
                }}
                value={tab}
            >
                <div
                    className='flex'
                >
                    <TabsList>
                        <TabsTrigger
                            value='pendingAdvances'
                        >
                            Pending Advances
                        </TabsTrigger>

                        <TabsTrigger
                            value='allAdvances'
                        >
                            All Advances
                        </TabsTrigger>
                    </TabsList>

                    <div
                        className='ml-auto space-x-3'
                    >
                        <Button
                            onClick={() => navigate('new')}
                        >
                            <Plus />

                            Request Advance
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
                </div>

                <Separator />

                <TabsContent
                    value='pendingAdvances'
                >
                    <AdvancesList
                        advances={advances}
                        getAllAdvancesIsFetching={getAllAdvancesIsFetching}
                    />
                </TabsContent>

                <TabsContent
                    value='allAdvances'
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