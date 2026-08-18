import type { AuthUser } from '../../middleware/auth.js';
import type {
    Category,
    CategoryListPage,
    CreateCategoryInput,
    UpdateCategoryInput,
} from '@remindme/contracts/categories';
import type { PaginationQuery } from '@remindme/contracts/common/pagination';

import { conflict } from '../../lib/errors.js';
import { getPaginationSkip, toPaginatedResponse } from '../../lib/pagination.js';
import { prisma } from '../../lib/prisma.js';

function toCategoryDto(
    category: { id: string; name: string },
    topicCount: number,
    entityCount: number,
): Category {
    return {
        id: category.id,
        name: category.name,
        topicCount,
        entityCount,
    };
}

async function countEntitiesInCategory(categoryId: string): Promise<number> {
    return prisma.entity.count({
        where: { topic: { categoryId } },
    });
}

async function countEntitiesByCategoryIds(categoryIds: string[]): Promise<Map<string, number>> {
    const counts = new Map<string, number>(categoryIds.map((id) => [id, 0]));

    if (categoryIds.length === 0) {
        return counts;
    }

    const topics = await prisma.topic.findMany({
        where: { categoryId: { in: categoryIds } },
        select: {
            categoryId: true,
            _count: { select: { entities: true } },
        },
    });

    for (const topic of topics) {
        counts.set(topic.categoryId, (counts.get(topic.categoryId) ?? 0) + topic._count.entities);
    }

    return counts;
}

export async function getCategory(user: AuthUser, categoryId: string): Promise<Category> {
    const { getCategoryForUser } = await import('../../lib/ownership.js');
    const category = await getCategoryForUser(categoryId, user);

    const [topicCount, entityCount] = await Promise.all([
        prisma.topic.count({
            where: { categoryId: category.id },
        }),
        countEntitiesInCategory(category.id),
    ]);

    return toCategoryDto(category, topicCount, entityCount);
}

export async function listCategories(user: AuthUser, pagination: PaginationQuery): Promise<CategoryListPage> {
    const where = { userId: user.id };
    const [totalItems, categories] = await Promise.all([
        prisma.category.count({ where }),
        prisma.category.findMany({
            where,
            orderBy: { position: 'asc' },
            skip: getPaginationSkip(pagination),
            take: pagination.pageSize,
            include: {
                _count: { select: { topics: true } },
            },
        }),
    ]);

    const entityCounts = await countEntitiesByCategoryIds(categories.map((category) => category.id));

    return toPaginatedResponse(
        categories.map((category) =>
            toCategoryDto(category, category._count.topics, entityCounts.get(category.id) ?? 0),
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

    return toCategoryDto(category, 0, 0);
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

    const entityCount = await countEntitiesInCategory(category.id);

    return toCategoryDto(category, category._count.topics, entityCount);
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
