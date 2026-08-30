import { useQuery } from '@tanstack/react-query';

import { getTopics } from '@/features/topics/api';
import { queryKeys } from '@/lib/query-keys';

const DEFAULT_PAGE_SIZE = 12;

export function useTopics(categoryId: string, page: number, pageSize = DEFAULT_PAGE_SIZE) {
    const pagination = { page, pageSize };

    return useQuery({
        queryKey: queryKeys.topics.list(categoryId, pagination),
        queryFn: () => getTopics(categoryId, pagination),
        staleTime: 0,
    });
}
