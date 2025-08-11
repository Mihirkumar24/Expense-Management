import { Plus } from 'lucide-react';
import {
    useFieldArray,
    useFormContext
} from 'react-hook-form';

// sahdcn/ui

import { Button } from '@/shared/ui/button';

import Criterion from './Criterion';
import CriteriaPattern from './CriteriaPattern';

export default function Criteria() {
    const form = useFormContext();

    const {
        fields: criteria,
        append: appendCriterion,
        remove: removeCriterion,
        update: updateCriterion
    } = useFieldArray({
        name: 'criteria',
        control: form.control
    });

    function handleAppendCriterion() {
        if (criteria.length === 0) {
            form.setValue('criteriaPattern', '1');
        } else {
            form.setValue(
                'criteriaPattern',
                form
                    .getValues('criteriaPattern')
                    .concat(` AND ${criteria.length + 1}`)
            );
        }

        appendCriterion({
            field: 'amount',
            comparator: '',
            value: ''
        });
    }

    return (
        <div
            className='space-y-6'
        >
            <h2
                className='font-semibold text-xl'
            >
                Criteria
            </h2>

            {criteria.map((criterion, index) => {
                return (
                    <Criterion
                        criterion={criterion}
                        index={index}
                        key={index}
                        removeCriterion={removeCriterion}
                        updateCriterion={updateCriterion}
                    />
                );
            })}

            <Button
                className='text-primary hover:bg-primary/5 hover:text-primary'
                onClick={handleAppendCriterion}
                type='button'
                size='sm'
                variant='ghost'
            >
                <Plus />

                Add criterion
            </Button>

            <CriteriaPattern
                criteria={criteria}
            />
        </div>
    );
}