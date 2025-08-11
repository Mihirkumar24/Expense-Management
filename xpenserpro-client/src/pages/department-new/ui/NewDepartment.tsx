import { zodResolver } from '@hookform/resolvers/zod';

import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';

import { useCreateDepartmentMutation } from '@/entities/department';
import { useLazyGetAllUsersQuery } from '@/entities/user';

import newDepartmentFormSchema from '../model/newDepartmentFormSchema';

export default function NewDepartment() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        createDepartment,
        {
            isLoading: createDepartmentIsLoading,
            isSuccess: createDepartmentIsSuccess
        }
    ] = useCreateDepartmentMutation();

    const [
        getAllUsers,
        {
            data: getAllUsersData
        }
    ] = useLazyGetAllUsersQuery();
    const users = getAllUsersData?.users;

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof newDepartmentFormSchema>>({
        defaultValues: {
            head: '',
            name: ''
        },
        resolver: zodResolver(newDepartmentFormSchema)
    });

    function handleCreateDepartment(value: z.infer<typeof newDepartmentFormSchema>) {
        const body = {
            ...value,
            organizationId: organization._id
        };

        createDepartment(body);
    }

    useEffect(() => {
        if (createDepartmentIsSuccess) {
            toast.success('Department created.');

            navigate('/administrator/settings/departments')
        }
    }, [createDepartmentIsSuccess]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Department
            </h1>

            <Separator />

            <Form
                {...form}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={form.handleSubmit(handleCreateDepartment)}
                >
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='head'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Project Head
                                </FormLabel>

                                <Select
                                    defaultValue={field.value}
                                    onOpenChange={(open) => {
                                        if (open) {
                                            getAllUsers(
                                                {
                                                    organization: organization._id
                                                },
                                                true
                                            );
                                        }
                                    }}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className='w-full'
                                        >
                                            <SelectValue
                                                placeholder='Select a user'
                                            />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {users ? (
                                            users.map((user, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={user._id}
                                                >
                                                    {`${user.firstName} ${user.lastName}`}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div
                                                className='flex'
                                            >
                                                <LoaderCircle
                                                    className='animate-spin m-auto'
                                                />
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={createDepartmentIsLoading}
                    >
                        {createDepartmentIsLoading && (
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