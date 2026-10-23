import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import { logout } from '@/features/auth/api';
import { queryKeys } from '@/lib/query-keys';

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            // Reset (not just remove) so components already mounted on the home page — header, "Your library" —
            // drop the signed-out user's data and re-render in the logged-out state.
            await queryClient.resetQueries({ queryKey: queryKeys.auth.currentUser });
            // Day-long staleTime caches are per user; drop them so the next login on this tab doesn't see them.
            queryClient.removeQueries({ queryKey: queryKeys.stats.all });
            queryClient.removeQueries({ queryKey: queryKeys.activity.all });
            await navigate({ to: '/' });
        },
    });
}
