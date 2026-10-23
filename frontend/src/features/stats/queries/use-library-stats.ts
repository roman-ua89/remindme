import { useQuery } from '@tanstack/react-query';

import { getLibraryStats } from '@/features/stats/api';
import { queryKeys } from '@/lib/query-keys';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Fresh for a day; category/topic/entity create & delete invalidate `queryKeys.stats.library` so the next visit refetches. */
export function useLibraryStats() {
    return useQuery({
        queryKey: queryKeys.stats.library,
        queryFn: getLibraryStats,
        staleTime: ONE_DAY_MS,
    });
}
