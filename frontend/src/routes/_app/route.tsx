import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { currentUserQueryOptions } from '@/features/auth/queries/current-user-query';
import { isUnauthorizedError } from '@/lib/auth';

export const Route = createFileRoute('/_app')({
    beforeLoad: async ({ context }) => {
        try {
            const user = await context.queryClient.fetchQuery(currentUserQueryOptions());
            if (typeof user.id === 'string') return;
        } catch (error) {
            if (!isUnauthorizedError(error)) throw error;
        }

        throw redirect({ to: '/', search: { login: true } });
    },
    component: AppLayout,
});

function AppLayout() {
    return <Outlet />;
}
