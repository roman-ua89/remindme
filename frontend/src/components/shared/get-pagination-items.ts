export type PaginationItemValue = number | 'ellipsis';

/**
 * Builds a compact page window: first, last, current ± siblings, with ellipsis gaps.
 */
export function getPaginationItems(page: number, totalPages: number, siblingCount = 1): PaginationItemValue[] {
    if (totalPages <= 0) {
        return [];
    }

    const totalNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalNumbers) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, totalPages);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const items: PaginationItemValue[] = [1];

    if (showLeftEllipsis) {
        items.push('ellipsis');
    } else {
        for (let pageNumber = 2; pageNumber < leftSibling; pageNumber += 1) {
            items.push(pageNumber);
        }
    }

    for (let pageNumber = leftSibling; pageNumber <= rightSibling; pageNumber += 1) {
        if (pageNumber !== 1 && pageNumber !== totalPages) {
            items.push(pageNumber);
        }
    }

    if (showRightEllipsis) {
        items.push('ellipsis');
    } else {
        for (let pageNumber = rightSibling + 1; pageNumber < totalPages; pageNumber += 1) {
            items.push(pageNumber);
        }
    }

    items.push(totalPages);

    return items;
}
