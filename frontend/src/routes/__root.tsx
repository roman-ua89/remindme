import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';

import { SunGlow } from '@/components/brand/SunGlow';
import { Toaster } from '@/components/ui/sonner';
import { currentUserQueryOptions } from '@/features/auth/queries/current-user-query';
import { useCurrentUser } from '@/features/auth/queries/use-current-user';
import { useScore } from '@/features/score/queries/use-score';
import { getAuthRedirect, isUnauthorizedError } from '@/lib/auth';
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

        const authRedirect = getAuthRedirect({
            isAuthenticated,
            pathname: location.pathname,
        });

        if (authRedirect) throw redirect({ to: '/', search: authRedirect.openLogin ? { login: true } : {} });
    },
    component: RootComponent,
});

/** Sun gradation of the logged-in user's level; guests and users whose score has not loaded yet get 2. */
const SunForUser = () => {
    const { data: user } = useCurrentUser();
    const isLoggedIn = typeof user?.id === 'string';
    const { data: score } = useScore({ enabled: isLoggedIn });

    const gradation = isLoggedIn ? score?.sunGradation : undefined;

    return <SunGlow gradation={gradation === 1 || gradation === 3 ? gradation : 2} />;
};

function RootComponent() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className='relative isolate flow-root'>
                <SunForUser />
                <Outlet />
            </div>
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
