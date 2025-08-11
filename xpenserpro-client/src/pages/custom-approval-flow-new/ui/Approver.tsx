import { Minus } from 'lucide-react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

// shadcn/ui
import { Button } from '@/shared/ui/button';

import { SelectFormField } from '@/features/form-field';

import approverTypes from '../model/approverTypes';
import newCustomApprovalFlowFormSchema from '../model/newCustomApprovalFlowFormSchema';

import ApproverSubTypeField from './ApproverSubTypeField';

export default function Approver({
    approver,
    index,
    removeApprover,
    updateApprover
}) {
    const form = useFormContext();

    const type = form.watch(`approvers.${index}.type`);

    useEffect(() => {
        updateApprover(
            index,
            {
                type,
                subType: ''
            }
        );

        form.clearErrors(`approvers.${index}`);
    }, [type]);

    return (
        <div
            className='flex gap-3'
            key={approver.id}
        >
            <SelectFormField<z.infer<typeof newCustomApprovalFlowFormSchema>>
                className='w-3xs'
                items={approverTypes}
                label='Type'
                name={`approvers.${index}.type`}
            />

            <ApproverSubTypeField
                className='w-3xs'
                index={index}
                type={type}
            />

            <Button
                className='hover:bg-destructive/5'
                onClick={() => removeApprover(index)}
                size='icon'
                type='button'
                variant='ghost'
            >
                <Minus className='text-destructive' />
            </Button>
        </div>
    );
}