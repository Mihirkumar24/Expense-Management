import { Minus } from 'lucide-react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

// shadcn / ui

import { Button } from '@/shared/ui/button';

import { SelectFormField } from '@/features/form-field';

import criterionFields from '../model/criterionFields';
import {
    numberComparators,
    stringComparators
} from '../model/criterionComparators';
import CriterionValueField from './CriterionValueField';
import type newCustomApprovalFlowFormSchema from '../model/newCustomApprovalFlowFormSchema';

export default function Criterion({
    criterion,
    index,
    removeCriterion,
    updateCriterion
}) {
    const form = useFormContext();

    const field = form.watch(`criteria.${index}.field`);

    function handleRemoveCriterion(index: number) {
        form.setValue(
            'criteriaPattern',
            form.getValues('criteriaPattern').slice(0, -6)
        );

        removeCriterion(index);
    }

    useEffect(() => {
        updateCriterion(
            index,
            {
                field,
                comparator: '',
                value: ''
            }
        );

        form.clearErrors(`criteria.${index}`);
    }, [field]);

    return (
        <div
            className='flex gap-3 items-end'
            key={criterion.id}
        >
            <p>
                {index + 1}
            </p>

            <SelectFormField<z.infer<typeof newCustomApprovalFlowFormSchema>>
                className='w-3xs'
                label='Field'
                name={`criteria.${index}.field`}
                items={criterionFields}
            />

            <SelectFormField<z.infer<typeof newCustomApprovalFlowFormSchema>>
                className='w-3xs'
                label='Comparator'
                name={`criteria.${index}.comparator`}
                items={field === 'amount' ? numberComparators : stringComparators}
            />

            <CriterionValueField
                className='w-3xs'
                field={field}
                index={index}
            />

            <Button
                className='hover:bg-destructive/5'
                onClick={() => handleRemoveCriterion(index)}
                size='icon'
                type='button'
                variant='ghost'
            >
                <Minus className='text-destructive' />
            </Button>
        </div>
    );
}