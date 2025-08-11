// shadcn/ui
import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/shared/ui/alert';
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

import { zodResolver } from '@hookform/resolvers/zod';

import {
    CircleAlert,
    LoaderCircle,
    Minus,
    Plus
} from 'lucide-react';
import { useEffect } from 'react';
import {
    useFieldArray,
    useForm,
    useWatch
} from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateProjectMutation } from '../../../entities/project/api/projectApi';
import { useLazyGetAllUsersQuery } from '../../../entities/user/api/userApi';

export default function NewProject() {
    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const navigate = useNavigate();

    const [
        createProject,
        {
            isSuccess: createProjectIsSuccess
        }
    ] = useCreateProjectMutation();

    const [
        getAllUsers,
        {
            data: getAllUsersData
        }
    ] = useLazyGetAllUsersQuery();
    const users = getAllUsersData?.users;

    const formSchema = z.object({
        name: z
            .string()
            .min(1, 'Enter a name.'),
        head: z
            .string()
            .min(1, 'Select a project head.'),
        members: z
            .array(
                z.object({
                    id: z
                        .string()
                        .min(1, 'Select a member.')
                })
            )
            .nonempty()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            name: '',
            head: '',
            members: []
        },
        resolver: zodResolver(formSchema)
    });

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control: form.control,
        name: 'members'
    });

    const head = useWatch({
        control: form.control,
        name: 'head'
    });

    const members = useWatch({
        control: form.control,
        name: 'members'
    });

    const selectedUsers = members.map((member) => member.id);
    selectedUsers.push(head);

    function handleCreateProject(data: z.infer<typeof formSchema>) {
        const body = {
            head: data.head,
            members: data.members.map((member) => member.id),
            name: data.name,
            organizationId: organization._id
        }

        createProject(body);
    }

    useEffect(() => {
        if (createProjectIsSuccess) {
            toast.success('Project is created.');

            navigate('/administrator/settings/projects');
        }
    }, [createProjectIsSuccess]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Project
            </h1>

            <Separator />

            <Form
                {...form}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={form.handleSubmit(handleCreateProject)}
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
                                                    organization: organization._id,
                                                    roles: ['administrator', 'approver']
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

                    <Separator />

                    <h2
                        className='font-semibold text-lg w-f'
                    >
                        Members
                    </h2>

                    <Separator />

                    {(form.formState.errors.members?.root?.message) && (
                        <Alert
                            className='border-destructive'
                            variant='destructive'
                        >
                            <CircleAlert />

                            <AlertTitle>
                                Error
                            </AlertTitle>

                            <AlertDescription>
                                Select a member.
                            </AlertDescription>
                        </Alert>
                    )}

                    {fields.map((field, index) => (
                        <FormField
                            control={form.control}
                            key={field.id}
                            name={`members.${index}.id`}
                            render={({ field }) => (
                                <FormItem
                                    className='grid-cols-[1fr_auto]'
                                >
                                    <FormLabel
                                        className='col-span-full'
                                    >
                                        Name
                                    </FormLabel>

                                    <Select
                                        defaultValue={field.value}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                getAllUsers(
                                                    {
                                                        organization: organization._id,
                                                        roles: ['administrator', 'approver']
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
                                                        disabled={selectedUsers.includes(user._id)}
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

                                    <Button
                                        className='text-destructive hover:text-destructive'
                                        onClick={() => remove(index)}
                                        size='icon'
                                        variant='ghost'
                                    >
                                        <Minus />
                                    </Button>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <Button
                        onClick={() => append({ id: '' })}
                        type='button'
                        variant='ghost'
                    >
                        <Plus />
                        Add member
                    </Button>

                    <Separator />

                    <Button
                        type='submit'
                    >
                        Save
                    </Button>
                </form>
            </Form>
        </div >
    )
}