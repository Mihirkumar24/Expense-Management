import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// shadcn/ui

import { Form } from '@/shared/ui/form';
import { Separator } from '@/shared/ui/separator';

import ExpenseCategories from '@/entities/expense-categories';
import {
    useCreatePolicyMutation,
    useUpdatePolicyMutation
} from '@/entities/policy';

import {
    InputFormField,
    TextareaFormField
} from '@/features/form-field';

import LoadingButton from '@/widgets/button-loading';

import newPolicyFormSchema from '../model/newPolicyFormSchema';
import ExpenseCategoryLimitsTable from './ExpenseCategoryLimitsTable';

export default function NewPolicyForm({
    policy
}) {
    const defaultValues = {
        name: policy?.name ?? '',
        description: policy?.description ?? '',
        expenseCategories: policy?.expenseCategories ?? ExpenseCategories.map((expenseCategory) => ({
            expenseCategory: expenseCategory.label,
            expenseCategoryLimit: -1
        }))
    }

    const newPolicyForm = useForm<z.infer<typeof newPolicyFormSchema>>({
        defaultValues,
        resolver: zodResolver(newPolicyFormSchema)
    });

    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        createPolicy,
        {
            isLoading: createPolicyIsLoading,
            isSuccess: createPolicyIsSuccess
        }
    ] = useCreatePolicyMutation();

    const [
        updatePolicy,
        {
            isLoading: updatePolicyIsLoading,
            isSuccess: updatePolicyIsSuccess
        }
    ] = useUpdatePolicyMutation();

    const navigate = useNavigate();

    function handleCreatePolicy(data: z.infer<typeof newPolicyFormSchema>) {
        const body = data;

        createPolicy({
            body,
            organizationId: organization._id
        });
    }

    function handleUpdatePolicy(data: z.infer<typeof newPolicyFormSchema>) {
        console.log('Updating...');

        const body = data;

        updatePolicy({
            body,
            policyId: policy._id
        });
    }

    useEffect(() => {
        if (createPolicyIsSuccess) {
            toast.success('Policy has been created.');

            navigate('/administrator/settings/policies');
        }

        if (updatePolicyIsSuccess) {
            toast.success('Policy has been updated.');

            navigate('/administrator/settings/policies');
        }
    }, [
        createPolicyIsSuccess,
        updatePolicyIsSuccess
    ]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <div
                className='font-medium text-2xl'
            >
                {policy ? 'Update Policy' : 'New Policy'}
            </div>

            <Separator />

            <Form
                {...newPolicyForm}
            >
                <form
                    className='space-y-6'
                    onSubmit={newPolicyForm.handleSubmit(
                        policy
                            ? handleUpdatePolicy
                            : handleCreatePolicy
                    )}
                >
                    <div
                        className='max-w-md space-y-6'
                    >
                        <InputFormField
                            label='Name'
                            name='name'
                        />

                        <TextareaFormField
                            label='Description'
                            name='description'
                        />
                    </div>

                    <div
                        className='font-semibold text-xl'
                    >
                        Expense Category Limits
                    </div>

                    <ExpenseCategoryLimitsTable />

                    <LoadingButton
                        loading={createPolicyIsLoading || updatePolicyIsLoading}
                    >
                        Save
                    </LoadingButton>
                </form>
            </Form>
        </div>
    );
}