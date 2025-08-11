import { useParams } from 'react-router';

import { useGetCustomApprovalFlowQuery } from '@/entities/custom-apprval-flow';

import NewCustomApprovalFLowForm from './NewCustomApprovalFlowForm';

export default function NewCustomApprovalFLow() {
    const { customApprovalFlowId } = useParams();
    const isUpdating = Boolean(customApprovalFlowId);

    const { data: customApprovalFlowData } = useGetCustomApprovalFlowQuery(customApprovalFlowId, { skip: !isUpdating });
    const customApprovalFlow = customApprovalFlowData?.customApprovalFlow;

    return (
        <NewCustomApprovalFLowForm
            customApprovalFlow={customApprovalFlow}
        />
    );
}