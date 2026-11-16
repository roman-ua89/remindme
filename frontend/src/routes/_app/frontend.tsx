import { createFileRoute } from '@tanstack/react-router';

import { DevPlanPage } from '@/features/dev-plan/components/DevPlanPage';

export const Route = createFileRoute('/_app/frontend')({
    component: DevPlanPage,
});
