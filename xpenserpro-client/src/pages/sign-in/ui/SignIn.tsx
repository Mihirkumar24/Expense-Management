import { zodResolver } from '@hookform/resolvers/zod';

import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
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

import { useSignInMutation } from '@/features/authentication';

export default function SignIn() {
    const { isAuthenticated } = useSelector((state) => state.authentication);

    const [
        signIn,
        {
            isLoading: signInIsLoading,
            isError: signInIsError,
            error: signInError
        }
    ] = useSignInMutation();

    const navigate = useNavigate();

    const formSchema = z.object({
        email: z
            .string()
            .email({
                message: 'Enter an email.'
            }),
        password: z
            .string()
            .min(1, 'Enter a password.')
    });

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: zodResolver(formSchema)
    });

    function handleSignIn(values: z.infer<typeof formSchema>) {
        const body = {
            ...values
        }

        signIn(body);
    }

    useEffect(() => {
        if (signInIsError) {
            const {
                data: {
                    message
                },
                status
            } = signInError;

            if (status === 404) {
                form.setError(
                    'email',
                    {
                        type: 'manual',
                        message
                    }
                );
            } else {
                form.setError(
                    'password',
                    {
                        type: 'manual',
                        message
                    }
                );
            }
        }

        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [
        signInIsError,
        signInError,
        isAuthenticated
    ]);

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
                            Welcome back
                        </CardTitle>

                        <CardDescription>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form
                            {...form}
                        >
                            <form
                                className='space-y-4'
                                onSubmit={form.handleSubmit(handleSignIn)}
                            >
                                <FormField
                                    control={form.control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='johndoe@email.com'
                                                    type='email'
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div
                                                className='flex'
                                            >
                                                <FormLabel>Password</FormLabel>
                                            </div>

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

                                <Button
                                    disabled={signInIsLoading}
                                    type='submit'
                                >
                                    {signInIsLoading && (
                                        <LoaderCircle
                                            className='animate-spin'
                                        />
                                    )}

                                    Sign In
                                </Button>

                                <div
                                    className='text-sm'
                                >
                                    Don't have an account?{' '}

                                    <Link
                                        className='underline-offset-4 hover:underline'
                                        to='/sign-up'
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}