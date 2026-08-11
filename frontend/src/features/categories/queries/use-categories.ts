import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/features/categories/api';
import { queryKeys } from '@/lib/query-keys';

const DEFAULT_PAGE_SIZE = 10;

export function useCategories(page: number, pageSize = DEFAULT_PAGE_SIZE) {
    const pagination = { page, pageSize };

    return useQuery({
        queryKey: queryKeys.categories.list(pagination),
        queryFn: () => getCategories(pagination),
        staleTime: 0,
    });
}
