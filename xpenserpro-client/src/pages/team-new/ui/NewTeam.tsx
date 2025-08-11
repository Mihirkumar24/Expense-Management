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

import { useLazyGetAllDepartmentsQuery } from '@/entities/department';
import { useCreateTeamMutation } from '@/entities/team';
import { useLazyGetAllUsersQuery } from '@/entities/user';

import newTeamFormSchema from '../model/newTeamFormSchema';

export default function NewTeam() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        getAllDepartments,
        {
            data: getAllDepartmentsData
        }
    ] = useLazyGetAllDepartmentsQuery();
    const departments = getAllDepartmentsData?.departments;

    const [
        createTeam,
        {
            isLoading: createTeamIsLoading,
            isSuccess: createTeamIsSuccess
        }
    ] = useCreateTeamMutation();

    const [
        getAllUsers,
        {
            data: getAllUsersData
        }
    ] = useLazyGetAllUsersQuery();
    const users = getAllUsersData?.users;

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof newTeamFormSchema>>({
        defaultValues: {
            department: '',
            head: '',
            name: ''
        },
        resolver: zodResolver(newTeamFormSchema)
    });

    function handleCreateTeam(value) {
        const body = {
            ...value,
            organizationId: organization._id
        };

        createTeam(body);
    }

    useEffect(() => {
        if (createTeamIsSuccess) {
            toast.success('Team created.');

            navigate('/administrator/settings/teams')
        }
    }, [createTeamIsSuccess]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Team
            </h1>

            <Separator />

            <Form
                {...form}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={form.handleSubmit(handleCreateTeam)}
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
                                    Team Head
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

                    <FormField
                        control={form.control}
                        name='department'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Department
                                </FormLabel>

                                <Select
                                    defaultValue={field.value}
                                    onOpenChange={(open) => {
                                        if (open) {
                                            getAllDepartments(organization._id, true);
                                        }
                                    }}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className='w-full'
                                        >
                                            <SelectValue
                                                placeholder='Select a department'
                                            />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {departments ? (
                                            departments.map((department, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={department._id}
                                                >
                                                    {`${department.name}`}
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
                        disabled={createTeamIsLoading}
                    >
                        {createTeamIsLoading && (
                            <LoaderCircle
                                className='animate-spin'
                            />
                        )}

                        Save
                    </Button>
                </form>
            </Form>
        </div>
    )
}