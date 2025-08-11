import { zodResolver } from '@hookform/resolvers/zod';

import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { z } from 'zod';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { Separator } from '@/shared/ui/separator';

import { useCreateAccountMutation } from '@/entities/account';

import {
    InputFormField,
    SelectFormField,
    TextareaFormField
} from '@/features/form-field';

import newAccountFormSchema from '../model/newAccountFormSchema';

export default function NewAccount() {
    const form = useForm<z.infer<typeof newAccountFormSchema>>({
        defaultValues: {
            name: '',
            code: '',
            type: 'cash',
            accountNumber: 0,
            description: '',
        },
        resolver: zodResolver(newAccountFormSchema)
    });

    const type = form.watch('type');

    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        createAccount,
        {
            isLoading: createAccountIsLoading,
            isSuccess: createAccountIsSuccess
        }
    ] = useCreateAccountMutation();

    const navigate = useNavigate();

    function handleCreateAccount(data: z.infer<typeof newAccountFormSchema>) {
        if (data.type === 'cash') {
            delete data.accountNumber;
        }

        const body = data;

        createAccount({
            body,
            organizationId: organization._id
        });
    }

    useEffect(() => {
        if (createAccountIsSuccess) {
            toast.success('Account is created.');

            navigate('/administrator/settings/accounts');

        }
    }, [createAccountIsSuccess]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Account
            </h1>

            <Separator />

            <Form
                {...form}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={form.handleSubmit(handleCreateAccount)}
                >
                    <InputFormField
                        label='Name'
                        name='name'
                    />

                    <InputFormField
                        label='Code'
                        name='code'
                    />

                    <SelectFormField
                        items={[
                            {
                                label: 'Bank',
                                value: 'bank'
                            },
                            {
                                label: 'Cash',
                                value: 'cash'
                            }
                        ]}
                        label='Type'
                        name='type'
                    />

                    {type === 'bank' && (
                        <InputFormField
                            label='Account Number'
                            name='accountNumber'
                        />
                    )}

                    <TextareaFormField
                        label='Description'
                        name='description'
                    />

                    <Button
                        disabled={createAccountIsLoading}
                    >
                        {createAccountIsLoading && (
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