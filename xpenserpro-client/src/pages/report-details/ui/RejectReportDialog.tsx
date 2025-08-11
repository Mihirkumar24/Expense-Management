import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

// shadcn/ui

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/shared/ui/dialog';
import { Form } from '@/shared/ui/form';

import { useRejectReportMutation } from '@/entities/report';

import { TextareaFormField } from '@/features/form-field';

import LoadingButton from '@/widgets/button-loading';

import rejectReportFormSchema from '../model/rejectReportFormSchema';
import { Button } from '@/shared/ui/button';

type RejectReportDialogProps = {
    reportId: string
}

export default function RejectReportDialog({
    reportId
}: RejectReportDialogProps) {
    const [open, setOpen] = useState(false);

    const rejectReportForm = useForm<z.infer<typeof rejectReportFormSchema>>({
        defaultValues: {
            reason: ''
        },
        resolver: zodResolver(rejectReportFormSchema)
    });

    const [
        rejectReport,
        {
            isLoading: rejectReportIsLoading,
            isSuccess: rejectReportIsSuccess
        }
    ] = useRejectReportMutation();

    function handleRejectReport(data: z.infer<typeof rejectReportFormSchema>) {
        const body = data;

        rejectReport({
            body,
            reportId
        });

        setOpen(false);
    }

    useEffect(() => {
        if (rejectReportIsSuccess) {
            toast.success('Report has been rejected.')
        }
    }, [rejectReportIsSuccess]);

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger
                asChild
            >
                <LoadingButton
                    loading={rejectReportIsLoading}
                    variant='destructive'
                >
                    Reject
                </LoadingButton>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Reject report
                    </DialogTitle>

                    <DialogDescription>
                        Please specify an appropriate reason for rejection.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...rejectReportForm}
                >
                    <form
                        onSubmit={rejectReportForm.handleSubmit(handleRejectReport)}
                        className='space-y-6'
                    >
                        <TextareaFormField<z.infer<typeof rejectReportFormSchema>>
                            label='Reason'
                            name='reason'
                        />

                        <DialogFooter>
                            <Button>
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}