import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    LoaderCircle
} from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { z } from 'zod';

// shadcn/ui
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { Textarea } from '@/shared/ui/textarea';

import { useLazyGetAllProjectsQuery } from '@/entities/project';
import { useCreateReportMutation } from '@/entities/report';

import Loader from '@/widgets/loader';

import newReportFormSchema from '../model/newReportFormSchema';
import { toast } from 'sonner';

export default function NewReport() {
    const form = useForm<z.infer<typeof newReportFormSchema>>({
        defaultValues: {
            businessPurpose: '',
            date: {
                from: undefined,
                to: undefined
            },
            name: '',
            project: ''
        },
        resolver: zodResolver(newReportFormSchema)
    });

    const {
        user: {
            organization
        }
    } = useSelector((state) => state.authentication);

    const [
        createReport,
        {
            isLoading: createReportIsLoading,
            isSuccess: createReportIsSuccess
        }
    ] = useCreateReportMutation();

    const [
        getAllProjects,
        {
            data: allProjectsData
        }
    ] = useLazyGetAllProjectsQuery();
    const projects = allProjectsData?.projects;

    const navigate = useNavigate();

    function handleCreateReport(data: z.infer<typeof newReportFormSchema>) {
        const body = { ...data };

        createReport(body);
    }

    useEffect(() => {
        if (createReportIsSuccess) {
            toast.success('Report is created.');

            navigate('/reports');
        }
    }, [createReportIsSuccess]);

    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                New Report
            </h1>

            <Separator />

            <Form
                {...form}
            >
                <form
                    className='max-w-md space-y-6'
                    onSubmit={form.handleSubmit(handleCreateReport)}
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
                        name='date'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Date
                                </FormLabel>

                                <Popover>
                                    <PopoverTrigger
                                        asChild
                                    >
                                        <FormControl>
                                            <Button
                                                type='button'
                                                variant='outline'
                                            >
                                                {field.value?.from ? (
                                                    field.value.to ? (
                                                        `${format(field.value.from, 'MMMM d, y')} - ${format(field.value.to, 'MMMM d, y')}`
                                                    ) : (
                                                        format(field.value.from, 'MMMM d, y')
                                                    )
                                                ) : (
                                                    'Select a date range.'
                                                )}

                                                <CalendarIcon
                                                    className='ml-auto'
                                                />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        align='start'
                                        className='p-0 w-auto'
                                    >
                                        <Calendar
                                            mode='range'
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='project'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Project
                                </FormLabel>

                                <Select
                                    defaultValue={field.value}
                                    onOpenChange={(open) => {
                                        if (open) {
                                            getAllProjects(organization._id, true);
                                        }
                                    }}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className='w-full'
                                        >
                                            <SelectValue
                                                placeholder='Select a project'
                                            />
                                        </SelectTrigger>
                                    </FormControl>

                                    <SelectContent>
                                        {projects ? (
                                            projects.map((project, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={project._id}
                                                >
                                                    {project.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <Loader />
                                        )}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='businessPurpose'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Business Purpose
                                </FormLabel>

                                <FormControl>
                                    <Textarea
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={createReportIsLoading}
                    >
                        {createReportIsLoading && (
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