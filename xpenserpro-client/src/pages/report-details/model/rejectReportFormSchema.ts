import { z } from 'zod';

export default z.object({
    reason: z
        .string()
        .min(1, 'Reason is required.')
});