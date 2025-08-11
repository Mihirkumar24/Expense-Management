import { z } from 'zod';

export default z.object({
    account: z
        .string()
        .min(1, 'Select an account.'),
    amount: z
        .coerce
        .number()
        .min(1, 'Enter an amount.'),
    currency: z
        .string()
        .min(3, 'Select a currency.'),
    currencyExchangeRate: z.number(),
    expenseCategory: z
        .string()
        .min(1, 'Select an expense category.'),
    department: z
        .string()
        .min(1, 'Select a department.'),
    date: z
        .object({
            from: z.date().optional(),
            to: z.date().optional()
        })
        .refine((val) => val.from && val.to, {
            message: 'Select a start date and an end date.'
        })
});