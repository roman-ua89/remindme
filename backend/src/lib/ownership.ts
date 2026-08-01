import type { AuthUser } from '../middleware/auth.js';
import { hasPermission } from '../middleware/require-permission.js';
import { prisma } from './prisma.js';
import { forbidden, notFound } from './errors.js';

export async function getCategoryForUser(categoryId: string, user: AuthUser) {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        throw notFound('Category not found');
    }

    if (category.userId !== user.id && !hasPermission(user, 'content:manage_any')) {
        throw forbidden();
    }

    return category;
}

export async function getTopicForUser(categoryId: string, topicId: string, user: AuthUser) {
    await getCategoryForUser(categoryId, user);

    const topic = await prisma.topic.findFirst({
        where: { id: topicId, categoryId },
    });

    if (!topic) {
        throw notFound('Topic not found');
    }

    return topic;
}

export async function getEntityForUser(categoryId: string, topicId: string, entityId: string, user: AuthUser) {
    await getTopicForUser(categoryId, topicId, user);

    const entity = await prisma.entity.findFirst({
        where: { id: entityId, topicId },
    });

    if (!entity) {
        throw notFound('Entity not found');
    }

    return entity;
}

export async function getEntityByIdForUser(entityId: string, user: AuthUser) {
    const entity = await prisma.entity.findUnique({
        where: { id: entityId },
        include: {
            topic: {
                include: {
                    category: true,
                },
            },
        },
    });

    if (!entity) {
        throw notFound('Entity not found');
    }

    if (entity.topic.category.userId !== user.id && !hasPermission(user, 'content:manage_any')) {
        throw forbidden();
    }

    return entity;
}
