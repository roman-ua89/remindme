import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getDailyActivity } from '@/features/activity/api';
import { queryKeys } from '@/lib/query-keys';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** Fresh for a day; Player Done/Skip invalidate `queryKeys.activity.all` so the next visit refetches. */
export function useDailyActivity(month: string) {
    return useQuery({
        queryKey: queryKeys.activity.daily(month),
        queryFn: () => getDailyActivity(month),
        staleTime: ONE_DAY_MS,
        placeholderData: keepPreviousData,
    });
}
