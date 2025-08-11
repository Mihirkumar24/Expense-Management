import { z } from 'zod';

const criterionUnion = z.discriminatedUnion(
    'field',
    [
        z.object({
            field: z.literal('amount'),
            comparator: z.enum(
                [
                    'lessThan',
                    'lessThanEqualTo',
                    'notEqualTo',
                    'equalTo',
                    'greaterThanEqualTo',
                    'greaterThan'
                ],
                { message: 'Select a comparator.' }
            ),
            value: z
                .string()
                .min(1, 'Enter an amount.')
        }),
        z.object({
            field: z.enum(
                [
                    'department',
                    'expenseCategory',
                    'project',
                    'team'
                ],
                { message: 'Select a field.' }
            ),
            comparator: z.enum(
                [
                    'notEqualTo',
                    'equalTo'
                ],
                { message: 'Select a comparator.' }
            ),
            value: z
                .string()
                .min(1, 'Select a value.'),
        })
    ]
);

const approverUnion = z.discriminatedUnion(
    'type',
    [
        z.object({
            type: z.literal('departmentHead'),
            subType: z
                .string()
                .min(1, 'Select a department.')
        }),
        z.object({
            type: z.literal('departmentHeadOfTheSubmitter')
        }),
        z.object({
            type: z.literal('hierarchy'),
            subType: z
                .string()
                .min(1, 'Select a level.')
        }),
        z.object({
            type: z.literal('manual'),
            subType: z
                .string()
                .min(1, 'Select a user.')
        }),
        z.object({
            type: z.literal('projectHead'),
            subType: z
                .string()
                .min(1, 'Select a project.')
        }),
        z.object({
            type: z.literal('teamHead'),
            subType: z
                .string()
                .min(1, 'Select a team.')
        }),
        z.object({
            type: z.literal('teamHeadOfTheSubmitter')
        }),
    ]
);

export default z
    .object({
        approvers: z.array(approverUnion),
        criteria: z.array(criterionUnion),
        criteriaPattern: z.string(),
        name: z
            .string()
            .min(1, 'Enter a name.')
    });