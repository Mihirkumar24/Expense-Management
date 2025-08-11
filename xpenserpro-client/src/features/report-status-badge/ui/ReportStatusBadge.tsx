import { cva } from 'class-variance-authority';

// shadcn/ui

import { Badge } from '@/shared/ui/badge';

type ReportStatusBadgeProps = {
    status: 'approved' | 'draft' | 'rejected' | 'submitted'
}

export default function ReportStatusBadge({
    status
}: ReportStatusBadgeProps) {
    if (status === 'draft') {
        return (
            <Badge
                className='tracking-widest'
                variant='secondary'
            >
                DRAFT
            </Badge>
        );
    }

    if (status === 'rejected') {
        return (
            <Badge
                className='tracking-widest'
                variant='destructive'
            >
                REJECTED
            </Badge >
        );
    }

    const statusBadgeVariants = cva('tracking-widest', {
        variants: {
            status: {
                approved: ['bg-emerald-500/10 text-emerald-500'],
                submitted: ['bg-amber-500/10 text-amber-500']
            }
        }
    });

    let label;

    if (status === 'approved') {
        label = 'APPROVED';
    }

    if (status === 'submitted') {
        label = 'PENDING APPROVAL';
    }

    return (
        <Badge
            className={statusBadgeVariants({ status })}
        >
            {label}
        </Badge>
    );
}