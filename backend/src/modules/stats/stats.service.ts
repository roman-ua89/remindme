import type { LibraryStatsResponse } from '@remindme/contracts/stats';

import type { AuthUser } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

/** Live counts (all indexed); deletes of non-empty categories/topics are blocked, so there are no cascades to track. */
export async function getLibraryStats(user: AuthUser): Promise<LibraryStatsResponse> {
    const [categoriesCount, topicsCount, entitiesCount] = await Promise.all([
        prisma.category.count({ where: { userId: user.id } }),
        prisma.topic.count({ where: { category: { userId: user.id } } }),
        prisma.entity.count({ where: { topic: { category: { userId: user.id } } } }),
    ]);

    return { categoriesCount, topicsCount, entitiesCount };
}
