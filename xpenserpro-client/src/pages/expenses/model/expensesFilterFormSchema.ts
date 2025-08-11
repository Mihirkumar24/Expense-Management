import { z } from 'zod';

export default z.object({
    category: z
        .string()
        .optional(),
    date: z.object({
        from: z
            .date()
            .optional(),
        to: z
            .date()
            .optional()
    }),
    merchant: z.string(),
    status: z
        .enum(['approved', 'reported', 'rejected', 'submitted', 'unreported'])
        .array()
});