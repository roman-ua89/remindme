import { Outlet, createFileRoute } from '@tanstack/react-router';

import { AuthLayout } from '@/components/layout/AuthLayout';

export const Route = createFileRoute('/auth')({
    component: AuthRouteLayout,
});

function AuthRouteLayout() {
    return (
        <AuthLayout>
            <Outlet />
        </AuthLayout>
    );
}
