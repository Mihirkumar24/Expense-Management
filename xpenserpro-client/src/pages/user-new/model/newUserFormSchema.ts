import { z } from 'zod';

export default z.object({
    approver: z
        .string()
        .min(1, 'Select an approver.'),
    department: z.string(),
    email: z
        .string()
        .email('Enter an email.'),
    firstName: z
        .string()
        .min(1, 'Enter a first name.'),
    lastName: z
        .string()
        .min(1, 'Enter a last name.'),
    level: z.string(),
    policy: z
        .string()
        .min(1, 'Select a policy.'),
    role: z.enum(['administrator', 'approver', 'submitter']),
    team: z.string()
});