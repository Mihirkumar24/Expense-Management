import { z } from 'zod';

export const formSchema = z.object({
    department: z
        .string()
        .min(1, 'Select a department.'),
    head: z
        .string()
        .min(1, 'Select a department.'),
    name: z
        .string()
        .min(1, 'Select a department.')
});

export default formSchema;