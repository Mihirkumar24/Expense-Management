import { z } from 'zod';

export default z
    .object({
        confirmPassword: z
            .string()
            .min(1, 'Enter a confirm password.'),
        email: z
            .string()
            .email({
                message: 'Enter an email.'
            }),
        firstName: z
            .string()
            .min(1, 'Enter a first name.'),
        level: z.number({
            required_error: 'Level is required.'
        }),
        lastName: z
            .string()
            .min(1, 'Enter a last name.'),
        organization: z
            .string()
            .min(1, 'Enter an organization.'),
        password: z
            .string()
            .min(1, 'Enter a password.')
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Those passwords didn\'t match. Try again.',
        path: ['confirmPassword']
    });