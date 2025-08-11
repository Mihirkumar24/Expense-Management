// shadcn/ui

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/shared/ui/card';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/shared/ui/sheet'

import { cn } from '@/shared/lib/utils';

export default function ApprovalFlow({
    approvalFlow,
    approvalFlowLevel
}) {
    return (
        <Sheet>
            <SheetTrigger
                asChild
            >
                <div
                    className='text-primary text-sm hover:cursor-pointer'
                >
                    View approval flow
                </div>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Approval FLow
                    </SheetTitle>
                </SheetHeader>

                <div
                    className='p-6'
                >
                    {approvalFlow.map((approver, index) => (
                        <Card
                            className={cn(
                                index < approvalFlowLevel && 'border-green-500',
                                index === approvalFlowLevel && 'border-amber-500',
                                index === approvalFlowLevel && status === 'rejected' && 'border-destructive'
                            )}
                            key={index}
                        >
                            <CardHeader>
                                <CardTitle>
                                    {approver.firstName} {approver.lastName}
                                </CardTitle>

                                <CardDescription>
                                    {approver.email}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}