import { zodResolver } from '@hookform/resolvers/zod';

import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    useNavigate,
    useParams
} from 'react-router';
import { z } from 'zod';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { useAcceptInvitationMutation } from '@/entities/user';

import acceptInvitationFormSchema from '../model/acceptInvitationFormSchema';

export default function AcceptInvitation() {
    const [
        acceptInvitation,
        {
            isLoading: acceptInvitationIsLoading,
            isSuccess: acceptInvitationIsSuccess
        }
    ] = useAcceptInvitationMutation();

    const navigate = useNavigate();

    const { invitationToken } = useParams();

    const acceptInvitationForm = useForm<z.infer<typeof acceptInvitationFormSchema>>({
        defaultValues: {
            confirmPassword: '',
            password: ''
        },
        resolver: zodResolver(acceptInvitationFormSchema)
    });

    function handleAcceptInvitation(data: z.infer<typeof acceptInvitationFormSchema>) {
        const body = data;

        acceptInvitation({ body, invitationToken });
    }

    useEffect(() => {
        if (acceptInvitationIsSuccess) {
            navigate('/sign-in');
        }
    }, [acceptInvitationIsSuccess]);

    return (
        <div
            className='bg-muted flex min-h-svh w-full'
        >
            <div
                className='m-auto max-w-sm space-y-6 w-full'
            >
                <h1
                    className='font-bold text-center text-4xl'
                >
                    <span
                        className='text-blue-700'
                    >
                        XPENSER
                    </span>

                    <span
                        className='ml-0.5'
                    >
                        PRO
                    </span>
                </h1>

                <Card>
                    <CardHeader>
                        <CardTitle
                            className='text-2xl'
                        >
                            Accept Invitation
                        </CardTitle>

                        <CardDescription>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form
                            {...acceptInvitationForm}
                        >
                            <form
                                className='space-y-4'
                                onSubmit={acceptInvitationForm.handleSubmit(handleAcceptInvitation)}
                            >
                                <FormField
                                    control={acceptInvitationForm.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Password
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Password'
                                                    type='password'
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={acceptInvitationForm.control}
                                    name='confirmPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm Password
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Confirm Password'
                                                    type='password'
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    disabled={acceptInvitationIsLoading}
                                    type='submit'
                                >
                                    {acceptInvitationIsLoading && (
                                        <LoaderCircle
                                            className='animate-spin'
                                        />
                                    )}

                                    Sign In
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}