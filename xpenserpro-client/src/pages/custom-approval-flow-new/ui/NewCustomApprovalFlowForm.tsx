import { zodResolver } from '@hookform/resolvers/zod';

import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    useNavigate,
    useParams
} from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { Separator } from '@/shared/ui/separator';

import {
    useCreateCustomApprovalFlowMutation,
    useUpdateCustomApprovalFlowMutation
} from '@/entities/custom-apprval-flow';

import { InputFormField } from '@/features/form-field';

import newCustomApprovalFlowFormSchema from '../model/newCustomApprovalFlowFormSchema';

import Criteria from './Criteria';
import Approvers from './Approvers';

export default function NewCustomApprovalFLowForm({
    customApprovalFlow
}) {
    const defaultValues = {
        approvers: customApprovalFlow?.approvers ?? [],
        criteria: customApprovalFlow?.criteria ?? [],
        criteriaPattern: customApprovalFlow?.criteriaPattern ?? '',
        name: customApprovalFlow?.name ?? ''
    };

    const newCustomApprovalFlowForm = useForm<z.infer<typeof newCustomApprovalFlowFormSchema>>({
        defaultValues,
        resolver: zodResolver(newCustomApprovalFlowFormSchema)
    });

    const {
        customApprovalFlowId,
        module
    } = useParams();

    const navigate = useNavigate();

    const [
        createCustomApprovalFlow,
        {
            isLoading: createCustomApprovalFlowIsLoading,
            isSuccess: createCustomApprovalFlowIsSuccess
        }
    ] = useCreateCustomApprovalFlowMutation();

    const [
        updateCustomApprovalFlow,
        {
            isLoading: updateCustomApprovalFlowIsLoading,
            isSuccess: updateCustomApprovalFlowIsSuccess
        }
    ] = useUpdateCustomApprovalFlowMutation();

    function handleCreateCustomApprovalFlow(data: z.infer<typeof newCustomApprovalFlowFormSchema>) {
        const body = {
            ...data,
            module
        };

        createCustomApprovalFlow(body);
    }

    function handleUpdateCustomApprovalFlow(data: z.infer<typeof newCustomApprovalFlowFormSchema>) {
        const body = data;

        updateCustomApprovalFlow({ customApprovalFlowId, body });
    }

    useEffect(() => {
        if (createCustomApprovalFlowIsSuccess) {
            toast.success('Custom approval flow is created.');

            navigate('/administrator/settings/custom-approval-flows');
        }

        if (updateCustomApprovalFlowIsSuccess) {
            toast.success('Custom approval flow is updated.');

            navigate('/administrator/settings/custom-approval-flows');
        }
    }, [
        createCustomApprovalFlowIsSuccess,
        updateCustomApprovalFlowIsSuccess
    ]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Custom Approval Flow
            </h1>

            <Separator />

            <Form
                {...newCustomApprovalFlowForm}
            >
                <form
                    className='space-y-6'
                    onSubmit={newCustomApprovalFlowForm.handleSubmit(
                        customApprovalFlow
                            ? handleUpdateCustomApprovalFlow
                            : handleCreateCustomApprovalFlow
                    )}
                >
                    <InputFormField
                        className='max-w-3xs'
                        label='Name'
                        name='name'
                    />

                    <Separator />

                    <Criteria />

                    <Separator />

                    <Approvers />

                    <Button
                        disabled={createCustomApprovalFlowIsLoading || updateCustomApprovalFlowIsLoading}
                    >
                        {(createCustomApprovalFlowIsLoading || updateCustomApprovalFlowIsLoading) && (
                            <LoaderCircle
                                className='animate-spin'
                            />
                        )}

                        Save
                    </Button>
                </form>
            </Form>
        </div>
    );
}