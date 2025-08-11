import { z } from 'zod';

export default z
    .object({
        confirmPassword: z.string(),
        password: z
            .string()
            .min(1, 'Enter a password.')
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Those passwords didn\'t match. Try again.',
        path: ['confirmPassword']
    });;