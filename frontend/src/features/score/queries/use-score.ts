import { useQuery } from '@tanstack/react-query';

import { getScore } from '@/features/score/api';
import { queryKeys } from '@/lib/query-keys';

type UseScoreOptions = {
    enabled?: boolean;
};

/** The logged-in user's score. Refetched on every mount because Player time changes it between visits. */
export function useScore({ enabled = true }: UseScoreOptions = {}) {
    return useQuery({
        queryKey: queryKeys.activity.score,
        queryFn: getScore,
        enabled,
        refetchOnMount: 'always',
        refetchOnWindowFocus: false,
    });
}
