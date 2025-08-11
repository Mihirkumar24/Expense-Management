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

import {
    type Account,
    useLazyGetAllAccountsQuery
} from '@/entities/account';

import {
    useCreateAdvanceMutation,
    useGetAllAdvancesQuery
} from '@/entities/advance';

import {
    AmountFormField,
    DateFormField,
    InputFormField,
    SelectFormField,
    SelectFormFieldWithLazyQuery
} from '@/features/form-field';

import LoadingButton from '@/widgets/button-loading';

import requestAdvanceFormSchema from '../model/requestAdvanceFormSchema';
import ExpenseCategories from '@/entities/expense-categories/model/ExpenseCategories';
import { AdvancesTable } from '@/pages/advances';

export default function RequestAdvance() {
    const requestAdvanceForm = useForm<z.infer<typeof requestAdvanceFormSchema>>({
        defaultValues: {
            amount: 0,
            currency: 'usd',
            date: new Date(Date.now()),
            referenceNumber: ''
        },
        resolver: zodResolver(requestAdvanceFormSchema)
    });

    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const {
        data: allAdvancesData,
        isFetching: getAllAdvancesIsFetching
    } = useGetAllAdvancesQuery({
        role: 'submitter',
        status: 'submitted'
    });
    const advances = allAdvancesData?.advances;

    const [
        createAdvance,
        {
            isLoading: createAdvanceIsLoading,
            isSuccess: createAdvanceIsSuccess,
            isError: createAdvanceIsError,
            error: createAdvanceError
        }
    ] = useCreateAdvanceMutation();

    const [
        getAllAccounts,
        {
            data: allAccountsData
        }
    ] = useLazyGetAllAccountsQuery();

    const navigate = useNavigate();

    function handleRequestAdvance(data: z.infer<typeof requestAdvanceFormSchema>) {
        const body = data;

        createAdvance(body);
    }

    useEffect(() => {
        if (createAdvanceIsSuccess) {
            toast.success('Advance requested.');

            // navigate('/advances?tab=allAdvances');
        }

        if (createAdvanceIsError) {
            const { message } = createAdvanceError.data;

            toast.error(message);
        }
    }, [
        createAdvanceIsSuccess,
        createAdvanceIsError,
        createAdvanceError
    ]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                Request Advance
            </h1>

            <Separator />

            <Form
                {...requestAdvanceForm}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={requestAdvanceForm.handleSubmit(handleRequestAdvance)}
                >
                    <DateFormField />

                    <AmountFormField />

                    <InputFormField<z.infer<typeof requestAdvanceFormSchema>>
                        label='Business Purpose'
                        name='businessPurpose'
                    />

                    <SelectFormField<z.infer<typeof requestAdvanceFormSchema>>
                        label='Expense Category'
                        items={ExpenseCategories}
                        name='expenseCategory'
                    />

                    <SelectFormFieldWithLazyQuery<z.infer<typeof requestAdvanceFormSchema>, Account>
                        data={allAccountsData}
                        label='Account'
                        mapFunction={(data: { accounts: Account[] }) => data.accounts.map((account) => ({
                            label: account.name,
                            value: account._id
                        }))}
                        name='account'
                        triggerFunction={getAllAccounts}
                        triggerFunctionArguments={organization._id}
                    />

                    <InputFormField
                        label='Description'
                        name='description'
                    />

                    <InputFormField
                        label='Reference Number'
                        name='referenceNumber'
                    />

                    <LoadingButton
                        loading={createAdvanceIsLoading}
                    >
                        Request Advance
                    </LoadingButton>
                </form>
            </Form>

            <Separator />

            <AdvancesTable
                advances={advances}
                getAllAdvancesIsFetching={getAllAdvancesIsFetching}
            />
        </div>
    );
}