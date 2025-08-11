import { z } from 'zod';

export default z.object({
    businessPurpose: z
        .string()
        .min(1, 'Enter a business purpose.'),
    date: z
        .object({
            from: z.date().optional(),
            to: z.date().optional()
        })
        .refine((val) => val.from && val.to, {
            message: 'Select a start date and an end date.'
        }),
    name: z
        .string()
        .min(1, 'Enter a name.'),
    project: z
        .string()
});