import { CircleAlert } from 'lucide-react';
import { useState } from 'react';

// shadcn/ui

import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useFormContext } from 'react-hook-form';

export default function CriteriaPattern({
    criteria
}) {
    const [currentCriteriaPattern, setCurrentCriteriaPattern] = useState('');

    const [isEditingCriteriaPattern, setIsEditingCriteriaPattern] = useState(false);

    const form = useFormContext();

    async function handleChangeCriteriaPattern(action: string) {
        if (action === 'save') {
            await form.trigger('criteriaPattern');

            if (form.formState.errors.criteriaPattern) {
                return;
            }

            setIsEditingCriteriaPattern(false);
        } else {
            form.setValue('criteriaPattern', currentCriteriaPattern);

            form.clearErrors('criteriaPattern');

            setIsEditingCriteriaPattern(false);
        }
    }

    return (
        <div
            className='space-y-6'
        >
            {form.formState.errors?.criteriaPattern && (
                <Alert
                    variant='destructive'
                >
                    <CircleAlert />

                    <AlertTitle>
                        Error
                    </AlertTitle>

                    <AlertDescription>
                        {form.formState.errors?.criteriaPattern.message}
                    </AlertDescription>
                </Alert>
            )}

            {criteria.length > 1 && (
                isEditingCriteriaPattern ? (
                    <div
                        className='bg-accent flex gap-3 items-center px-1.5 py-3'
                    >
                        <p className='text-sm'>
                            Criteria pattern:
                        </p>

                        <Input
                            className='bg-white w-3xs'
                            {...form.register('criteriaPattern')}
                        />

                        <Button
                            onClick={() => handleChangeCriteriaPattern('save')}
                            size='sm'
                            type='button'
                        >
                            Save
                        </Button>

                        <Button
                            className='bg-white hover:bg-white hover:text-primary'
                            onClick={() => handleChangeCriteriaPattern('cancel')}
                            size='sm'
                            type='button'
                            variant='secondary'
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <div
                        className='bg-accent flex gap-3 items-center px-1.5 py-3'
                    >
                        <p className='text-sm'>
                            Criteria pattern: <span className='font-bold'>{`${form.getValues('criteriaPattern')}`}</span>
                        </p>

                        <Button
                            onClick={() => {
                                setCurrentCriteriaPattern(form.getValues('criteriaPattern'));
                                setIsEditingCriteriaPattern(true);
                            }}
                            size='sm'
                            type='button'
                        >
                            Change
                        </Button>
                    </div>
                )
            )}
        </div>
    );
}