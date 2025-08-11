import { z } from 'zod';

export default z.object({
    account: z
        .string()
        .min(1, 'Select an account.'),
    amount: z
        .coerce
        .number()
        .min(1, 'Enter an amount.'),
    businessPurpose: z
        .string()
        .min(1, 'Enter a business purpose.'),
    currency: z
        .string()
        .min(3, 'Select a currency.'),
    currencyExchangeRate: z
        .coerce
        .number()
        .min(1, 'Enter a currency exchange rate.'),
    date: z.date({
        message: 'Select a date.'
    }),
    description: z.string().optional(),
    expenseCategory: z
        .string()
        .min(1, 'Select an expense category.'),
    referenceNumber: z
        .string()
        .min(1, 'Enter a reference number.')
});