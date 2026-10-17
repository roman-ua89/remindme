import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { HomePage } from '@/features/home/components/HomePage';

const homeSearchSchema = z.object({
    /** `true` opens the login dialog (set by the auth guards and the header's Log in button). */
    login: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute('/')({
    validateSearch: homeSearchSchema,
    component: HomePage,
});
