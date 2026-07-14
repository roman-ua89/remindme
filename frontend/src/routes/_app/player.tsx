import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { PlayerPage } from '@/features/player/components/PlayerPage';
import type { PlayerScope } from '@/features/player/types';

const playerSearchSchema = z
    .object({
        categoryId: z.string().optional(),
        topicId: z.string().optional(),
        entityId: z.string().optional(),
    })
    .refine(
        (search) => {
            const count = [search.categoryId, search.topicId, search.entityId].filter(Boolean).length;
            return count === 1;
        },
        { message: 'Exactly one of categoryId, topicId, or entityId is required' },
    );

export const Route = createFileRoute('/_app/player')({
    validateSearch: playerSearchSchema,
    component: PlayerRoute,
});

function PlayerRoute() {
    const search = Route.useSearch();
    const scope = toPlayerScope(search);

    if (!scope) {
        throw redirect({ to: '/' });
    }

    return <PlayerPage scope={scope} />;
}

function toPlayerScope(search: z.infer<typeof playerSearchSchema>): PlayerScope | null {
    if (search.categoryId) {
        return { type: 'category', categoryId: search.categoryId };
    }
    if (search.topicId) {
        return { type: 'topic', topicId: search.topicId };
    }
    if (search.entityId) {
        return { type: 'entity', entityId: search.entityId };
    }
    return null;
}
