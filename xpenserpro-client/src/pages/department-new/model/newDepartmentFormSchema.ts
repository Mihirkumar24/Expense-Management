import { z } from 'zod';

const formSchema = z.object({
    head: z
        .string()
        .min(1, 'Select a head.'),
    name: z
        .string()
        .min(1, 'Enter a name.')
});

export default formSchema;