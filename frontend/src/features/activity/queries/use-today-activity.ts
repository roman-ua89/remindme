import { useQuery } from '@tanstack/react-query';

import { getTodayActivity } from '@/features/activity/api';
import { queryKeys } from '@/lib/query-keys';

/** Today's counters; always refetched on mount because the Player timer starts from `playerSeconds`. */
export function useTodayActivity() {
    return useQuery({
        queryKey: queryKeys.activity.today,
        queryFn: getTodayActivity,
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
    });
}
