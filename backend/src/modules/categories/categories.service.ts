import type { AuthUser } from '../../middleware/auth.js';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@remindme/contracts/categories';

import { prisma } from '../../lib/prisma.js';
import { conflict } from '../../lib/errors.js';

function toCategoryDto(category: { id: string; name: string }, topicCount: number): Category {
    return {
        id: category.id,
        name: category.name,
        topicCount,
    };
}

export async function getCategory(user: AuthUser, categoryId: string): Promise<Category> {
    const { getCategoryForUser } = await import('../../lib/ownership.js');
    const category = await getCategoryForUser(categoryId, user);

    const topicCount = await prisma.topic.count({
        where: { categoryId: category.id },
    });

    return toCategoryDto(category, topicCount);
}

export async function listCategories(user: AuthUser): Promise<Category[]> {
    const categories = await prisma.category.findMany({
        where: { userId: user.id },
        orderBy: { position: 'asc' },
        include: {
            _count: { select: { topics: true } },
        },
    });

    return categories.map((category) => toCategoryDto(category, category._count.topics));
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

    return toCategoryDto(category, 0);
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

    return toCategoryDto(category, category._count.topics);
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
