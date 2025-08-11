import { z } from 'zod';

export default z.object({
    comment: z
        .string()
        .min(1, 'Enter a comment')
});