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

import { useCreateAccountsPayableMutation } from '@/entities/accounts-payable';

import {
    DateFormField,
    InputFormField,
    SelectFormField
} from '@/features/form-field';

import LoadingButton from '@/widgets/button-loading';

import newInvoiceRecordingFormSchema from '../model/newInvoiceRecordingFormSchema';

export default function NewInvoiceRecordingForm() {
    const defaultValues = {
        transactionDate: new Date(),
        transactionType: 'Office Expenses',
        invoiceDate: new Date(),
        company: 'USMF',
        mainAccount: '',
        description: '',
        debit: 0,
        credit: 0,
        offsetAccount: '',
        methodOfPayment: '',
        termsOfPayment: 'Cash',
        dueDate: new Date(),
        exchangeRate: 0
    }

    const newInvoiceRecordingForm = useForm<z.infer<typeof newInvoiceRecordingFormSchema>>({
        defaultValues,
        resolver: zodResolver(newInvoiceRecordingFormSchema)
    });

    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        createAccountsPayable,
        {
            isLoading: createAccountsPayableIsLoading,
            isSuccess: createAccountsPayableIsSuccess
        }
    ] = useCreateAccountsPayableMutation();

    const navigate = useNavigate();

    function handleCreateAccountsPayable(data: z.infer<typeof newInvoiceRecordingFormSchema>) {
        const body = {
            ...data,
            organizationId: organization._id
        }

        createAccountsPayable(body);
    }

    useEffect(() => {
        if (createAccountsPayableIsSuccess) {
            toast.success('Invoice has been created.');

            navigate('/invoice-recording');
        }
    }, [createAccountsPayableIsSuccess]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Invoice Recording
            </h1>

            <Separator />

            <Form
                {...newInvoiceRecordingForm}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={newInvoiceRecordingForm.handleSubmit(handleCreateAccountsPayable)}
                >
                    <DateFormField<z.infer<typeof newInvoiceRecordingFormSchema>>
                        label='Transaction Date'
                        name='transactionDate'
                    />

                    <SelectFormField
                        items={[
                            {
                                label: 'Office Expenses',
                                value: 'Office Expenses'
                            },
                            {
                                label: 'Telephone Expenses',
                                value: 'Telephone Expenses'
                            },
                            {
                                label: 'Electricity',
                                value: 'Electricity'
                            },
                            {
                                label: 'Commission',
                                value: 'Commission'
                            },
                            {
                                label: 'Purchase Expenses',
                                value: 'Purchase Expenses'
                            },
                            {
                                label: 'Employee Training Expenses',
                                value: 'Employee Training Expenses'
                            }
                        ]}
                        label='Transaction Type'
                        name='transactionType'
                    />

                    <DateFormField<z.infer<typeof newInvoiceRecordingFormSchema>>
                        label='Invoice Date'
                        name='invoiceDate'
                    />

                    <SelectFormField
                        items={[
                            {
                                label: 'USMF',
                                value: 'USMF'
                            },
                            {
                                label: 'INMF',
                                value: 'INMF'
                            },
                            {
                                label: 'USPM',
                                value: 'USPM'
                            },
                            {
                                label: 'USSI',
                                value: 'USSI'
                            }
                        ]}
                        label='Company'
                        name='company'
                    />

                    <InputFormField
                        label='Main Account'
                        name='mainAccount'
                    />

                    <InputFormField
                        label='Description'
                        name='description'
                    />

                    <InputFormField
                        label='Debit'
                        name='debit'
                    />

                    <InputFormField
                        label='Credit'
                        name='credit'
                    />

                    <InputFormField
                        label='Offset Account'
                        name='offsetAccount'
                    />

                    <InputFormField
                        label='Method of payment'
                        name='methodOfPayment'
                    />

                    <SelectFormField
                        items={[
                            {
                                label: 'Cash',
                                value: 'Cash'
                            },
                            {
                                label: 'COD',
                                value: 'COD'
                            },
                            {
                                label: 'NET30',
                                value: 'NET30'
                            }
                        ]}
                        label='Terms of payment'
                        name='termsOfPayment'
                    />

                    <DateFormField<z.infer<typeof newInvoiceRecordingFormSchema>>
                        label='Due Date'
                        name='dueDate'
                    />

                    <InputFormField
                        label='Exchange Rate'
                        name='exchangeRate'
                    />

                    <LoadingButton
                        loading={createAccountsPayableIsLoading}
                    >
                        Save
                    </LoadingButton>
                </form>
            </Form>
        </div>
    );
}