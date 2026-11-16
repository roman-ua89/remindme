import { useQuery } from '@tanstack/react-query';

import { currentUserQueryOptions } from '@/features/auth/queries/current-user-query';

export function useCurrentUser() {
    return useQuery(currentUserQueryOptions());
}
