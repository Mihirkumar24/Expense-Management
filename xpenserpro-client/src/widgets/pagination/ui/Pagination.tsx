import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/ui/pagination';

function renderPageNumbers(count, onChange, page) {
    const items = [];
    const maxVisiblePages = 5;

    if (count <= maxVisiblePages) {
        for (let i = 1; i <= count; i++) {
            items.push(
                <PaginationItem
                    key={i}
                    onClick={() => onChange(i)}
                >
                    <PaginationLink
                        isActive={page === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
    } else {
        items.push(
            <PaginationItem
                key={1}
                onClick={() => onChange(1)}
            >
                <PaginationLink
                    isActive={page === 1}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        if (page > 3) {
            items.push(
                <PaginationItem
                    key='ellipsis-start'
                >
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        const start = Math.max(2, page - 1);
        const end = Math.min(count - 1, page + 1);

        for (let i = start; i <= end; i++) {
            items.push(
                <PaginationItem
                    key={i}
                    onClick={() => onChange(i)}
                >
                    <PaginationLink
                        isActive={page === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (page < count - 2) {
            items.push(
                <PaginationItem
                    key='ellipsis-end'
                >
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        items.push(
            <PaginationItem
                key={count}
                onClick={() => onChange(count)}
            >
                <PaginationLink
                    isActive={page === count}
                >
                    {count}
                </PaginationLink>
            </PaginationItem>
        );
    }

    return items;
};

export default function EnhancedPagination({
    count,
    onChange,
    page
}) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        aria-disabled={page === 1}
                        onClick={() => onChange(page - 1)}
                        tabIndex={page === 1 ? -1 : undefined}
                        className={page === 1 ? 'pointer-events-none text-muted-foreground' : undefined}
                    />
                </PaginationItem>

                {renderPageNumbers(count, onChange, page)}

                <PaginationItem>
                    <PaginationNext
                        aria-disabled={page === count}
                        onClick={() => onChange(page + 1)}
                        tabIndex={page === count ? -1 : undefined}
                        className={page === count ? 'pointer-events-none text-muted-foreground' : undefined}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}