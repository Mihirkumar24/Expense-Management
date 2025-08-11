import { zodResolver } from '@hookform/resolvers/zod';

import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
    toast,
    Toaster
} from 'sonner';
import { z } from 'zod';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
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

import { useSignUpMutation } from '@/features/authentication';

import signUpFormSchema from '../model/signUpFormSchema';

export default function SignIn() {
    const { isAuthenticated } = useSelector((state) => state.authentication);

    const [
        signUp,
        {
            isLoading: signUpIsLoading,
            isSuccess: signUpIsSuccess,
            isError: signUpIsError,
            error: signUpError
        }
    ] = useSignUpMutation();

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        defaultValues: {
            confirmPassword: '',
            email: '',
            firstName: '',
            lastName: '',
            level: 1,
            organization: '',
            password: ''
        },
        resolver: zodResolver(signUpFormSchema)
    });

    function handleSignUp(data: z.infer<typeof signUpFormSchema>) {
        const body = data;

        signUp(body);
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/sign-in');
        }

        if (signUpIsError) {
            form.setError(
                'email',
                {
                    type: 'manual',
                    message: signUpError.data.message
                }
            );
        }

        if (signUpIsSuccess) {
            toast.success('Account is created.');
        }
    }, [
        isAuthenticated,
        signUpIsError,
        signUpIsSuccess,
        signUpError
    ]);

    return (
        <div
            className='bg-muted flex min-h-svh p-6 w-full'
        >
            <Toaster
                position='top-center'
                richColors
            />

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
                            Sign Up
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Form
                            {...form}
                        >
                            <form
                                className='space-y-6'
                                onSubmit={form.handleSubmit(handleSignUp)}
                            >
                                <FormField
                                    control={form.control}
                                    name='firstName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                First Name
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
                                    name='lastName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Last Name
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
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email
                                            </FormLabel>

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
                                    control={form.control}
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

                                <FormField
                                    control={form.control}
                                    name='organization'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Organization
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

                                <Button
                                    disabled={signUpIsLoading}
                                    type='submit'
                                >
                                    {signUpIsLoading && (
                                        <LoaderCircle
                                            className='animate-spin'
                                        />
                                    )}

                                    Sign Up
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}