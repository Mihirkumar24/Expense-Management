import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

// shadcn/ui

import { Separator } from '@/shared/ui/separator';
import { Button } from '@/shared/ui/button';

import { useGetAllPoliciesQuery } from '@/entities/policy';

import PoliciesTable from './PoliciesTable';

export default function Policies() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allPoliciesData,
        isFetching: getAllPoliciesIsFetching
    } = useGetAllPoliciesQuery(organization._id);
    const policies = allPoliciesData?.policies;

    const navigate = useNavigate();

    return (
        <div
            className='p-6 space-y-6'
        >
            <div
                className='flex'
            >
                <div
                    className='font-medium text-2xl'
                >
                    Policies
                </div>

                <Button
                    className='ml-auto'
                    onClick={() => navigate('new')}
                >
                    <Plus />

                    New Policy
                </Button>
            </div>

            <Separator />

            <PoliciesTable
                getAllPoliciesIsFetching={getAllPoliciesIsFetching}
                policies={policies}
            />
        </div>
    );
}