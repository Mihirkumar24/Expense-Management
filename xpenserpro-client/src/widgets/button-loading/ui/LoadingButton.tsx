import type { VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import type React from 'react';

import {
    Button,
    buttonVariants
} from '@/shared/ui/button';

type LoadingButtonProps = {
    className?: string,
    loading: boolean
}

export default function LoadingButton({
    className,
    children,
    loading,
    size,
    variant,
    ...props
}: React.ComponentProps<'button'>
    & VariantProps<typeof buttonVariants>
    & LoadingButtonProps
) {
    return (
        <Button
            className={className}
            disabled={loading}
            size={size}
            variant={variant}
            {...props}
        >
            {loading && (
                <LoaderCircle
                    className='animate-spin'
                />
            )}
            {children}
        </Button>
    );
}