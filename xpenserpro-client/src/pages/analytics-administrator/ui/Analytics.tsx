// shadcn/ui

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

export default function Analytics() {
    return (
        <div
            className='p-6 space-y-6'
        >
            <h1
                className='font-medium text-2xl'
            >
                Analytics
            </h1>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle
                        className='text-2xl'
                    >
                        Expenses
                    </CardTitle>
                </CardHeader>

                <CardContent
                    className='space-y-3'
                >
                    <p
                        className='hover:text-primary'
                    >
                        All Expenses
                    </p>

                    <p
                        className='hover:text-primary'
                    >
                        Expenses by User
                    </p>

                    <p
                        className='hover:text-primary'
                    >
                        Expenses by User
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}