import { z } from 'zod';

export default z.object({
    amount: z
        .number({
            required_error: 'Enter an amount.'
        })
        .refine((val) => val > 0, {
            message: 'Enter a valid amount.'
        }),
    businessPurpose: z
        .string()
        .min(1, 'Enter a business purpose.'),
    category: z
        .string()
        .min(1, 'Select a category.'),
    currency: z
        .string()
        .min(1, 'Select a currency.'),
    currencyExchangeRate: z
        .number({
            required_error: 'Enter a currency exchange rate.'
        })
        .refine((val) => val > 0, {
            message: 'Enter a valid currency exchange rate.'
        }),
    date: z.date(),
    description: z
        .string()
        .min(1, 'Enter a description.'),
    merchant: z
        .string()
        .min(1, 'Enter a merchant.'),
    paymentMethod: z
        .string()
        .min(1, 'Select a payment method.')
});