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

import { useLazyGetAllAccountsQuery } from '@/entities/account';
import { useCreateBudgetMutation } from '@/entities/budget';
import {
    useLazyGetAllDepartmentsQuery,
    type Department
} from '@/entities/department';
import ExpenseCategories from '@/entities/expense-categories';

import {
    AmountFormField,
    DateRangeFormField,
    SelectFormField,
    SelectFormFieldWithLazyQuery
} from '@/features/form-field';

import LoadingButton from '@/widgets/button-loading';

import newBudgetFormSchema from '../model/newBudgetFormSchema';

export default function NewBudgetForm() {
    const defaultValues = {
        account: '',
        amount: 0,
        currency: 'usd',
        currencyExchangeRate: 1,
        date: {
            from: undefined,
            to: undefined
        },
        department: '',
        expenseCategory: ''
    }

    const newBudgetForm = useForm<z.infer<typeof newBudgetFormSchema>>({
        defaultValues,
        resolver: zodResolver(newBudgetFormSchema)
    });

    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        createBudget,
        {
            isLoading: createBudgetIsLoading,
            isSuccess: createBudgetIsSuccess
        }
    ] = useCreateBudgetMutation();

    const [
        getAllAccounts,
        {
            data: allAccountsData
        }
    ] = useLazyGetAllAccountsQuery();

    const [
        getAllDepartments,
        {
            data: allDepartmentsData
        }
    ] = useLazyGetAllDepartmentsQuery();

    const navigate = useNavigate();

    function handleCreateBudget(data: z.infer<typeof newBudgetFormSchema>) {
        const body = {
            ...data,
            organizationId: organization._id
        }

        createBudget(body);
    }

    useEffect(() => {
        if (createBudgetIsSuccess) {
            toast.success('Budget has been created.');

            navigate('/administrator/settings/budgets');
        }
    }, [createBudgetIsSuccess]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Budget
            </h1>

            <Separator />

            <Form
                {...newBudgetForm}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={newBudgetForm.handleSubmit(handleCreateBudget)}
                >
                    <DateRangeFormField />

                    <SelectFormFieldWithLazyQuery<z.infer<typeof newBudgetFormSchema>, Department>
                        data={allDepartmentsData}
                        label='Department'
                        mapFunction={(data: { departments: Department[] }) => data.departments.map((department) => ({
                            label: department.name,
                            value: department._id
                        }))}
                        name='department'
                        triggerFunction={getAllDepartments}
                        triggerFunctionArguments={organization._id}
                    />

                    <SelectFormFieldWithLazyQuery<z.infer<typeof newBudgetFormSchema>, Department>
                        data={allAccountsData}
                        label='Account'
                        mapFunction={(data) => data.accounts.map((account) => ({
                            label: account.name,
                            value: account._id
                        }))}
                        name='account'
                        triggerFunction={getAllAccounts}
                        triggerFunctionArguments={organization._id}
                    />

                    <SelectFormField<z.infer<typeof newBudgetFormSchema>>
                        className='w-full'
                        label='Expense Category'
                        items={ExpenseCategories}
                        name='expenseCategory'
                    />

                    <AmountFormField />

                    <LoadingButton
                        loading={createBudgetIsLoading}
                    >
                        Save
                    </LoadingButton>
                </form>
            </Form>
        </div>
    );
}