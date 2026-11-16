import { queryOptions } from '@tanstack/react-query';

import { getCurrentUser } from '@/features/auth/api';
import { queryKeys } from '@/lib/query-keys';

export function currentUserQueryOptions() {
    return queryOptions({
        queryKey: queryKeys.auth.currentUser,
        queryFn: getCurrentUser,
    });
}
