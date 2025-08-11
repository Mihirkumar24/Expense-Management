import { zodResolver } from '@hookform/resolvers/zod';

import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { z } from 'zod';

// shadcn/ui

import { Button } from '@/shared/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { useAddCommentToReportMutation } from '@/entities/report';

import newCommentFormSchema from '../model/newCommentFormSchema';

export default function Comments({
    comments
}) {
    const newCommentForm = useForm<z.infer<typeof newCommentFormSchema>>({
        defaultValues: {
            comment: ''
        },
        resolver: zodResolver(newCommentFormSchema)
    });

    const [
        addCommentToReport,
        {
            isLoading: addCommentToReportIsLoading
        }
    ] = useAddCommentToReportMutation();

    const { reportId } = useParams();

    function handleAddCommentToReport(data: z.infer<typeof newCommentFormSchema>) {
        const body = data;

        addCommentToReport({
            body,
            reportId
        })
    }
    return (
        <div
            className='bg-muted px-48 py-6'
        >
            <Form
                {...newCommentForm}
            >
                <form
                    className='space-y-3'
                    onSubmit={newCommentForm.handleSubmit(handleAddCommentToReport)}
                >
                    <FormField
                        control={newCommentForm.control}
                        name='comment'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className='bg-white'
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div
                        className='flex flex-row-reverse gap-3'
                    >
                        <Button
                            disabled={addCommentToReportIsLoading}
                            size='sm'
                        >
                            {addCommentToReportIsLoading && (
                                <LoaderCircle
                                    className='animate-spin'
                                />
                            )}

                            Send
                        </Button>
                    </div>
                </form>
            </Form>

            <div
                className='space-y-3'
            >
                {comments.map((comment, index) => (
                    <div
                        key={index}
                    >
                        <p
                            className='text-sm text-muted-foreground'
                        >
                            {comment.commentator.firstName} {comment.commentator.lastName}
                        </p>

                        <p>
                            {comment.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}