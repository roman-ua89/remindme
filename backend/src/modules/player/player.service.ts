import type {
    PlayerApiScope,
    PlayerBatchRequest,
    PlayerBatchResponse,
} from '@remindme/contracts/player';
import type { Prisma } from '@prisma/client';

import type { AuthUser } from '../../middleware/auth.js';
import {
    getCategoryForUser,
    getEntityByIdForUser,
    getTopicByIdForUser,
} from '../../lib/ownership.js';
import { prisma } from '../../lib/prisma.js';
import { loadEntitiesWithCategory } from '../entities/entities.service.js';

/** Server clamp — matches frontend PLAYER_BATCH_SIZE until profile settings exist. */
const MAX_PLAYER_BATCH_SIZE = 10;

function clampLimit(limit: number): number {
    return Math.min(Math.max(1, limit), MAX_PLAYER_BATCH_SIZE);
}

function shuffleIds(ids: string[]): string[] {
    const copy = [...ids];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        const current = copy[index]!;
        copy[index] = copy[swapIndex]!;
        copy[swapIndex] = current;
    }

    return copy;
}

async function assertScopeOwnership(scope: PlayerApiScope, user: AuthUser): Promise<void> {
    switch (scope.type) {
        case 'category':
            await getCategoryForUser(scope.categoryId, user);
            return;
        case 'topic':
            await getTopicByIdForUser(scope.topicId, user);
            return;
        case 'entity':
            await getEntityByIdForUser(scope.entityId, user);
    }
}

function buildEligibleWhere(
    scope: PlayerApiScope,
    excludeEntityIds: string[],
): Prisma.EntityWhereInput | null {
    const visibilityFilter = { visibility: 'included' as const };

    if (scope.type === 'entity') {
        if (excludeEntityIds.includes(scope.entityId)) {
            return null;
        }

        return {
            ...visibilityFilter,
            id: scope.entityId,
        };
    }

    const excludeFilter =
        excludeEntityIds.length > 0 ? { id: { notIn: excludeEntityIds } } : {};

    if (scope.type === 'category') {
        return {
            ...visibilityFilter,
            ...excludeFilter,
            topic: { categoryId: scope.categoryId },
        };
    }

    return {
        ...visibilityFilter,
        ...excludeFilter,
        topicId: scope.topicId,
    };
}

export async function getPlayerBatch(
    user: AuthUser,
    input: PlayerBatchRequest,
): Promise<PlayerBatchResponse> {
    await assertScopeOwnership(input.scope, user);

    const where = buildEligibleWhere(input.scope, input.excludeEntityIds);
    if (!where) {
        return { items: [] };
    }

    const minResult = await prisma.entity.aggregate({
        where,
        _min: { scheduleCount: true },
    });

    if (minResult._min.scheduleCount === null) {
        return { items: [] };
    }

    const candidates = await prisma.entity.findMany({
        where: {
            ...where,
            scheduleCount: minResult._min.scheduleCount,
        },
        select: { id: true },
    });

    const pickedIds = shuffleIds(candidates.map((candidate) => candidate.id)).slice(
        0,
        clampLimit(input.limit),
    );

    return {
        items: await loadEntitiesWithCategory(pickedIds),
    };
}
