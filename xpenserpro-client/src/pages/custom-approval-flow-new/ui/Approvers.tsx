import { Plus } from 'lucide-react';
import {
    useFieldArray,
    useFormContext
} from 'react-hook-form';

// shadcn/ui
import { Button } from '@/shared/ui/button';

import Approver from './Approver';

export default function Approvers() {
    const form = useFormContext();

    const {
        fields: approvers,
        append: appendApprover,
        remove: removeApprover,
        update: updateApprover
    } = useFieldArray({
        name: 'approvers',
        control: form.control
    });

    function handleAppendApprover() {
        appendApprover({
            type: 'departmentHead',
            subType: ''
        });
    }

    return (
        <div
            className='space-y-6'
        >
            <h2
                className='font-semibold text-xl'
            >
                Approvers
            </h2>

            {approvers.map((approver, index) => {
                return (
                    <Approver
                        approver={approver}
                        index={index}
                        key={index}
                        removeApprover={removeApprover}
                        updateApprover={updateApprover}
                    />
                );
            })}

            <Button
                className='text-primary hover:bg-primary/5 hover:text-primary'
                onClick={handleAppendApprover}
                type='button'
                size='sm'
                variant='ghost'
            >
                <Plus />

                Add approver
            </Button>
        </div>
    );
}