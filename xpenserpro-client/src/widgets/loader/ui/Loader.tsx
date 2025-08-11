import { cn } from '@/shared/lib/utils';
import { LoaderCircle } from 'lucide-react';

type Props = {
    className?: string
}

export default function Loader({
    className
}: Props) {
    return (
        <div
            className={cn('flex', className)}
        >
            <LoaderCircle
                className='animate-spin m-auto'
            />
        </div>
    )
}