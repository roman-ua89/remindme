import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/sonner';
import { currentUserQueryOptions } from '@/features/auth/queries/current-user-query';
import { getAuthRedirectTarget, isUnauthorizedError } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';

import '../index.css';

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    beforeLoad: async ({ context, location }) => {
        let isAuthenticated = false;
        try {
            const user = await context.queryClient.fetchQuery(currentUserQueryOptions());
            isAuthenticated = typeof user.id === 'string';
        } catch (error) {
            if (!isUnauthorizedError(error)) throw error;
        }

        const redirectTo = getAuthRedirectTarget({
            isAuthenticated,
            pathname: location.pathname,
        });

        if (redirectTo) throw redirect({ to: redirectTo });
    },
    component: RootComponent,
});

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <Outlet />
            <Toaster />
            <TanStackDevtools
                config={{
                    position: 'bottom-right',
                }}
                plugins={[
                    {
                        name: 'TanStack Router',
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                ]}
            />
        </QueryClientProvider>
    );
}
