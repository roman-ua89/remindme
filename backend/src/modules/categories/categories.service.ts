import type { AuthUser } from '../../middleware/auth.js';
import type {
    Category,
    CategoryListPage,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '@remindme/contracts/categories';
import type { PaginationQuery } from '@remindme/contracts/common/pagination';
import type { EntityMarker } from '@remindme/contracts/entities';

import { findTopicMarkers } from '../../lib/entity-markers.js';
import { findTopicExcludedCounts } from '../../lib/entity-visibility.js';
import { conflict } from '../../lib/errors.js';
import { getPaginationSkip, toPaginatedResponse } from '../../lib/pagination.js';
import { prisma } from '../../lib/prisma.js';

type CategoryStats = {
    entityCount: number;
    completion: number;
    markers: EntityMarker[];
    hasExcludedEntities: boolean;
};

const EMPTY_STATS: CategoryStats = { entityCount: 0, completion: 0, markers: [], hasExcludedEntities: false };

function toCategoryDto(category: { id: string; name: string }, topicCount: number, stats: CategoryStats): Category {
    return {
        id: category.id,
        name: category.name,
        topicCount,
        entityCount: stats.entityCount,
        completion: stats.completion,
        markers: stats.markers,
        hasExcludedEntities: stats.hasExcludedEntities,
    };
}

/**
 * entityCount counts all entities; completion is the share of included entities already past the
 * category's lowest scheduleCount, i.e. progress through the current Player round.
 */
async function getCategoryStatsByIds(categoryIds: string[]): Promise<Map<string, CategoryStats>> {
    const stats = new Map<string, CategoryStats>(categoryIds.map((id) => [id, { ...EMPTY_STATS }]));

    if (categoryIds.length === 0) {
        return stats;
    }

    const [topics, tiers, topicMarkers, excludedTopics] = await Promise.all([
        prisma.topic.findMany({
            where: { categoryId: { in: categoryIds } },
            select: {
                id: true,
                categoryId: true,
                _count: { select: { entities: true } },
            },
        }),
        prisma.entity.groupBy({
            by: ['topicId', 'scheduleCount'],
            where: { topic: { categoryId: { in: categoryIds } }, visibility: 'included' },
            _count: { _all: true },
        }),
        findTopicMarkers({ topic: { categoryId: { in: categoryIds } } }),
        findTopicExcludedCounts({ topic: { categoryId: { in: categoryIds } } }),
    ]);

    const categoryByTopicId = new Map<string, string>();
    for (const topic of topics) {
        categoryByTopicId.set(topic.id, topic.categoryId);
        const current = stats.get(topic.categoryId);
        if (current) {
            current.entityCount += topic._count.entities;
        }
    }

    const tiersByCategory = new Map<string, { scheduleCount: number; count: number }[]>();
    for (const tier of tiers) {
        const categoryId = categoryByTopicId.get(tier.topicId);
        if (!categoryId) {
            continue;
        }
        const list = tiersByCategory.get(categoryId) ?? [];
        list.push({ scheduleCount: tier.scheduleCount, count: tier._count._all });
        tiersByCategory.set(categoryId, list);
    }

    for (const [categoryId, list] of tiersByCategory) {
        const min = Math.min(...list.map((tier) => tier.scheduleCount));
        let total = 0;
        let ahead = 0;
        for (const tier of list) {
            total += tier.count;
            if (tier.scheduleCount > min) {
                ahead += tier.count;
            }
        }
        const current = stats.get(categoryId);
        if (current && total > 0) {
            current.completion = Math.floor((ahead / total) * 100);
        }
    }

    const markersByCategory = new Map<string, Set<EntityMarker>>();
    for (const { topicId, marker } of topicMarkers) {
        const categoryId = categoryByTopicId.get(topicId);
        if (!categoryId) {
            continue;
        }
        const markers = markersByCategory.get(categoryId) ?? new Set<EntityMarker>();
        markers.add(marker);
        markersByCategory.set(categoryId, markers);
    }

    for (const [categoryId, markers] of markersByCategory) {
        const current = stats.get(categoryId);
        if (current) {
            current.markers = [...markers];
        }
    }

    for (const { topicId } of excludedTopics) {
        const categoryId = categoryByTopicId.get(topicId);
        const current = categoryId ? stats.get(categoryId) : undefined;
        if (current) {
            current.hasExcludedEntities = true;
        }
    }

    return stats;
}

async function getCategoryStats(categoryId: string): Promise<CategoryStats> {
    const stats = await getCategoryStatsByIds([categoryId]);
    return stats.get(categoryId) ?? EMPTY_STATS;
}

export async function getCategory(user: AuthUser, categoryId: string): Promise<Category> {
    const { getCategoryForUser } = await import('../../lib/ownership.js');
    const category = await getCategoryForUser(categoryId, user);

    const [topicCount, stats] = await Promise.all([
        prisma.topic.count({
            where: { categoryId: category.id },
        }),
        getCategoryStats(category.id),
    ]);

    return toCategoryDto(category, topicCount, stats);
}

export async function listCategories(user: AuthUser, pagination: PaginationQuery): Promise<CategoryListPage> {
    const where = { userId: user.id };
    const [totalItems, categories] = await Promise.all([
        prisma.category.count({ where }),
        prisma.category.findMany({
            where,
            orderBy: { position: 'desc' },
            skip: getPaginationSkip(pagination),
            take: pagination.pageSize,
            include: {
                _count: { select: { topics: true } },
            },
        }),
    ]);

    const stats = await getCategoryStatsByIds(categories.map((category) => category.id));

    return toPaginatedResponse(
        categories.map((category) =>
            toCategoryDto(category, category._count.topics, stats.get(category.id) ?? EMPTY_STATS),
        ),
        totalItems,
        pagination,
    );
}

export async function createCategory(user: AuthUser, input: CreateCategoryInput): Promise<Category> {
    const maxPosition = await prisma.category.aggregate({
        where: { userId: user.id },
        _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;

    const category = await prisma.category.create({
        data: {
            userId: user.id,
            name: input.name,
            position,
        },
    });

    return toCategoryDto(category, 0, EMPTY_STATS);
}

export async function updateCategory(
    user: AuthUser,
    categoryId: string,
    input: UpdateCategoryInput,
): Promise<Category> {
    const { getCategoryForUser } = await import('../../lib/ownership.js');
    await getCategoryForUser(categoryId, user);

    const category = await prisma.category.update({
        where: { id: categoryId },
        data: { name: input.name },
        include: {
            _count: { select: { topics: true } },
        },
    });

    const stats = await getCategoryStats(category.id);

    return toCategoryDto(category, category._count.topics, stats);
}

export async function deleteCategory(user: AuthUser, categoryId: string): Promise<void> {
    const { getCategoryForUser } = await import('../../lib/ownership.js');
    const category = await getCategoryForUser(categoryId, user);

    const topicCount = await prisma.topic.count({
        where: { categoryId: category.id },
    });

    if (topicCount > 0) {
        throw conflict('Cannot delete a category that contains topics');
    }

    await prisma.category.delete({ where: { id: categoryId } });
}
