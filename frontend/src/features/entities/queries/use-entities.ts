import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getEntities } from '@/features/entities/api';
import { queryKeys } from '@/lib/query-keys';

const DEFAULT_PAGE_SIZE = 12;

export function useEntities(categoryId: string, topicId: string, page: number, pageSize = DEFAULT_PAGE_SIZE, search?: string) {
    const query = { page, pageSize, ...(search ? { search } : {}) };

    return useQuery({
        queryKey: queryKeys.entities.list(categoryId, topicId, query),
        queryFn: () => getEntities(categoryId, topicId, query),
        placeholderData: keepPreviousData
    });
}
