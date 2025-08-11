import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

// sahdcn/ui

import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';

export default function ExpenseCategoryLimitDialog({
    expenseCategory,
    index
}) {
    const newPolicyForm = useFormContext();

    const [open, setOpen] = useState(false);
    const [limit, setLimit] = useState({
        isError: false,
        value: newPolicyForm.getValues(`expenseCategories[${index}].expenseCategoryLimit`),
    });

    function handleLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
        const newLimit = event.currentTarget.value;

        const isDouble = /^(\d+(\.\d+)?)?$/.test(newLimit);

        setLimit({
            isError: !isDouble,
            value: newLimit
        });
    }

    function handleSaveLimit() {
        if (limit.isError) {
            return;
        }

        newPolicyForm.setValue(`expenseCategories[${index}].expenseCategoryLimit`, limit.value);

        setOpen(false);
    }

    return (
        <Dialog
            onOpenChange={setOpen}
            open={open}
        >
            <DialogTrigger
                asChild
            >
                <Button
                    className='text-muted-foreground'
                    size='icon'
                    type='button'
                    variant='ghost'
                >
                    <Pencil />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {expenseCategory}
                    </DialogTitle>
                </DialogHeader>

                <div
                    className='flex'
                >
                    <div
                        className='border bg-muted border-r-0 flex items-center p-1 rounded-l-md'
                    >
                        USD
                    </div>

                    <Input
                        className={'rounded-l-none'}
                        onChange={handleLimitChange}
                        value={limit.value}
                        aria-invalid={limit.isError}
                    />
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => setOpen(false)}
                        variant='secondary'
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSaveLimit}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}