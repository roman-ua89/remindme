import type { MouseEvent } from 'react';

import { getPaginationItems } from '@/components/shared/get-pagination-items';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

type ListPaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const activePageClassName =
    'border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover hover:text-primary-foreground';

export const ListPagination = ({ page, totalPages, onPageChange }: ListPaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    const items = getPaginationItems(page, totalPages);
    const canGoPrevious = page > 1;
    const canGoNext = page < totalPages;

    function handlePageClick(event: MouseEvent<HTMLAnchorElement>, nextPage: number) {
        event.preventDefault();
        if (nextPage === page || nextPage < 1 || nextPage > totalPages) {
            return;
        }
        onPageChange(nextPage);
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href='#'
                        aria-disabled={!canGoPrevious}
                        className={!canGoPrevious ? 'pointer-events-none opacity-50' : undefined}
                        onClick={(event) => handlePageClick(event, page - 1)}
                    />
                </PaginationItem>

                {items.map((item, index) =>
                    item === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={item}>
                            <PaginationLink
                                href='#'
                                isActive={item === page}
                                className={item === page ? activePageClassName : undefined}
                                onClick={(event) => handlePageClick(event, item)}
                            >
                                {item}
                            </PaginationLink>
                        </PaginationItem>
                    ),
                )}

                <PaginationItem>
                    <PaginationNext
                        href='#'
                        aria-disabled={!canGoNext}
                        className={!canGoNext ? 'pointer-events-none opacity-50' : undefined}
                        onClick={(event) => handlePageClick(event, page + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
