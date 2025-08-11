import { z } from 'zod';

export default z.object({
    name: z
        .string()
        .min(1, 'Enter a name.'),
    code: z
        .string()
        .min(1, 'Enter a code.'),
    type: z.enum(['bank', 'cash']),
    accountNumber: z
        .coerce
        .number({
            message: 'Enter an account number.'
        })
        .optional(),
    description: z
        .string()
        .optional(),
}).refine((value) => value.type === 'bank' ? !!value.accountNumber : true, {
    message: 'Enter an account number.',
    path: ['accountNumber'],
});