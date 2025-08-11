import { z } from 'zod';

export default z.object({
    transactionDate: z.date(),
    transactionType: z.enum([
        'Office Expenses',
        'Telephone Expenses',
        'Electricity',
        'Commission',
        'Purchase Expenses',
        'Employee Training Expenses'
    ]),
    invoiceDate: z.date(),
    company: z.enum([
        'USMF',
        'INMF',
        'USPM',
        'USSI'
    ]),
    mainAccount: z
        .string()
        .min(1, 'Enter a main account / category.'),
    description: z
        .string()
        .min(1, 'Enter a description.'),
    debit: z
        .coerce
        .number(),
    credit: z
        .coerce
        .number(),
    offsetAccount: z
        .string()
        .min(1, 'Enter an offset account.'),
    methodOfPayment: z
        .string()
        .min(1, 'Enter a method of payment.'),
    termsOfPayment: z.enum([
        'Cash',
        'COD',
        'NET30'
    ]),
    dueDate: z.date(),
    exchangeRate: z
        .coerce
        .number()
});