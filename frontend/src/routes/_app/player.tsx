import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

import { PlayerPage } from '@/features/player/components/PlayerPage';
import type { PlayerScope } from '@/features/player/types';

const playerSearchSchema = z
    .object({
        categoryId: z.string().optional(),
        topicId: z.string().optional(),
        entityId: z.string().optional(),
        preview: z.string().optional(),
        returnTo: z.string().optional(),
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
    if (search.entityId && search.preview) {
        return { type: 'entity', entityId: search.entityId, preview: true };
    }
    return null;
}

function PlayerRoute() {
    const search = Route.useSearch();
    const scope = toPlayerScope(search);

    if (!scope) {
        throw redirect({ to: '/categories' });
    }

    const scopeKey = scope.type === 'category' ? scope.categoryId : scope.type === 'topic' ? scope.topicId : scope.entityId;

    return <PlayerPage key={scopeKey} scope={scope} returnTo={search.returnTo} />;
}
