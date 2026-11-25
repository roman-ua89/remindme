import { useQuery } from '@tanstack/react-query';

import { getScore } from '@/features/score/api';
import { queryKeys } from '@/lib/query-keys';

/** The logged-in user's score. Refetched on every mount because Player time changes it between visits. */
export function useScore() {
    return useQuery({
        queryKey: queryKeys.activity.score,
        queryFn: getScore,
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
    });
}
