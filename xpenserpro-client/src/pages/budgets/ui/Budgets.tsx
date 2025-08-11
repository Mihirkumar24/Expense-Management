import {
    ArrowUpDown,
    Funnel,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router';

// sahdcn/ui

import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';

import { useGetAllBudgetsQuery } from '@/entities/budget';

import BudgetsTable from './BudgetsTable';
import { useSelector } from 'react-redux';

export default function Departments() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allBudgetsData,
        isFetching: allBudgetsDataIsFetching
    } = useGetAllBudgetsQuery(organization._id);
    const budgets = allBudgetsData?.budgets;

    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='text-2xl'
            >
                Budgets
            </h1>

            <Separator />

            <div
                className='flex flex-row-reverse gap-3'
            >
                <Button
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Budget
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

            <BudgetsTable
                budgets={budgets}
            />
        </div>
    );
}