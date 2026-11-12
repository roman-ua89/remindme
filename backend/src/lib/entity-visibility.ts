import type { Prisma } from '@prisma/client';

import { prisma } from './prisma.js';

/** Excluded entity count per topic; topics without excluded entities are absent. */
export async function findTopicExcludedCounts(
    where: Prisma.EntityWhereInput,
): Promise<{ topicId: string; excludedCount: number }[]> {
    const rows = await prisma.entity.groupBy({
        by: ['topicId'],
        where: { ...where, visibility: 'excluded' },
        _count: { _all: true },
    });

    return rows.map((row) => ({ topicId: row.topicId, excludedCount: row._count._all }));
}
