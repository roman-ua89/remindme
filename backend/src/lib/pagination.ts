import type { PaginatedResponse, PaginationQuery } from '@remindme/contracts/common/pagination';

export function getPaginationSkip({ page, pageSize }: PaginationQuery): number {
    return (page - 1) * pageSize;
}

export function toPaginatedResponse<T>(
    items: T[],
    totalItems: number,
    { page, pageSize }: PaginationQuery,
): PaginatedResponse<T> {
    return {
        items,
        page,
        pageSize,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
    };
}
