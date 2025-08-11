import { useParams } from 'react-router';

import { useGetPolicyQuery } from '@/entities/policy';

import Loader from '@/widgets/loader';

import NewPolicyForm from './NewPolicyForm';

export default function NewPolicy() {
    const { policyId } = useParams();
    const isUpdating = Boolean(policyId);

    const {
        data: policyData,
        isLoading: getPolicyIsLoading
    } = useGetPolicyQuery(policyId, { skip: !isUpdating });
    const policy = policyData?.policy;

    if (getPolicyIsLoading) {
        return (
            <Loader
                className='min-h-svh'
            />
        );
    }

    return (
        <NewPolicyForm
            policy={policy}
        />
    );
}