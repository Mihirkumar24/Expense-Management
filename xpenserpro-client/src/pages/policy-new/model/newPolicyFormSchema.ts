import { z } from 'zod';

const expenseCategory = z.object({
    expenseCategory: z
        .string()
        .min(1, 'Enter an expense category.'),
    expenseCategoryLimit: z
        .coerce
        .number()
});

export default z.object({
    name: z
        .string()
        .min(1, 'Enter a name.'),
    description: z
        .string()
        .min(1, 'Enter a description.'),
    expenseCategories: z.array(expenseCategory)
});