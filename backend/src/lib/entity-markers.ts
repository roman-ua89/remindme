import type { Prisma } from '@prisma/client';
import type { EntityMarker } from '@remindme/contracts/entities';

import { prisma } from './prisma.js';

/** Distinct markers per topic, ordered by marker so anything bucketed from these rows stays ascending. */
export async function findTopicMarkers(
    where: Prisma.EntityWhereInput,
): Promise<{ topicId: string; marker: EntityMarker }[]> {
    const rows = await prisma.entity.groupBy({
        by: ['topicId', 'marker'],
        where: { ...where, marker: { not: null } },
        orderBy: { marker: 'asc' },
    });

    return rows.map((row) => ({ topicId: row.topicId, marker: row.marker as EntityMarker }));
}
