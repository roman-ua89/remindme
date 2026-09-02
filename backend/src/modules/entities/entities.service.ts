import type {
    CodeContentJson,
    Entity,
    EntityBlockResponse,
    EntityListItem,
    EntityListPage,
    ListBlockContentJson,
    SaveEntityInput,
    UpdateEntityInput,
} from '@remindme/contracts/entities';
import { MAX_ENTITY_BLOCKS } from '@remindme/contracts/entities';
import type { ListSearchQuery } from '@remindme/contracts/common/pagination';
import type { BlockType, EntityBlock, EntityVisibility, Prisma } from '@prisma/client';

import type { AuthUser } from '../../middleware/auth.js';
import { getEntityByIdForUser, getEntityForUser, getTopicForUser } from '../../lib/ownership.js';
import { badRequest } from '../../lib/errors.js';
import { mediaUrl } from '../../lib/media-url.js';
import { getPaginationSkip, toPaginatedResponse } from '../../lib/pagination.js';
import { textContainsFilter } from '../../lib/search.js';
import { prisma } from '../../lib/prisma.js';
import { deleteMediaAssetsIfUnreferenced } from '../media/media.service.js';

type BlockWithRows = EntityBlock & {
    listRows: Array<{
        id: string;
        position: number;
        leftValue: string;
        rightValue: string;
    }>;
    mediaAsset: { id: string; storageKey: string } | null;
};

function toEntityListItem(entity: {
    id: string;
    topicId: string;
    title: string;
    revisedCount: number;
    skippedCount: number;
    visibility: EntityVisibility;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}): EntityListItem {
    return {
        id: entity.id,
        topicId: entity.topicId,
        title: entity.title,
        revisedCount: entity.revisedCount,
        skippedCount: entity.skippedCount,
        visibility: entity.visibility,
        position: entity.position,
        createdAt: entity.createdAt.toISOString(),
        updatedAt: entity.updatedAt.toISOString(),
    };
}

function toCodeBlockContentJson(contentJson: unknown): CodeContentJson {
    const json = contentJson as Partial<CodeContentJson> | null | undefined;
    return {
        language: json?.language === 'typescript' ? 'typescript' : 'javascript',
        value: typeof json?.value === 'string' ? json.value : '',
        blurredByDefault: json?.blurredByDefault ?? false,
    };
}

function toListBlockContentJson(contentJson: unknown): ListBlockContentJson {
    const json = contentJson as Partial<ListBlockContentJson> | null | undefined;
    return {
        blurRightSideByDefault: json?.blurRightSideByDefault ?? false,
    };
}

function toBlockResponse(block: BlockWithRows): EntityBlockResponse {
    switch (block.blockType) {
        case 'text':
            return {
                id: block.id,
                blockType: 'text',
                position: block.position,
                contentJson: (block.contentJson ?? {}) as Record<string, unknown>,
            };
        case 'code':
            return {
                id: block.id,
                blockType: 'code',
                position: block.position,
                contentJson: toCodeBlockContentJson(block.contentJson),
            };
        case 'image':
            return {
                id: block.id,
                blockType: 'image',
                position: block.position,
                mediaAssetId: block.mediaAssetId!,
                mediaUrl: block.mediaAsset ? mediaUrl(block.mediaAsset.storageKey) : undefined,
            };
        case 'list':
            return {
                id: block.id,
                blockType: 'list',
                position: block.position,
                contentJson: toListBlockContentJson(block.contentJson),
                rows: block.listRows.map((row) => ({
                    id: row.id,
                    position: row.position,
                    leftValue: row.leftValue,
                    rightValue: row.rightValue,
                })),
            };
        default:
            throw badRequest('Unsupported block type');
    }
}

const entityBlocksInclude = {
    blocks: {
        orderBy: { position: 'asc' as const },
        include: {
            listRows: { orderBy: { position: 'asc' as const } },
            mediaAsset: true,
        },
    },
};

async function loadEntityWithBlocks(entityId: string): Promise<Entity> {
    const entity = await prisma.entity.findUnique({
        where: { id: entityId },
        include: entityBlocksInclude,
    });

    if (!entity) {
        throw badRequest('Entity not found');
    }

    return {
        ...toEntityListItem(entity),
        blocks: entity.blocks.map((block) => toBlockResponse(block as BlockWithRows)),
    };
}

export async function loadEntitiesWithCategory(entityIds: string[]): Promise<Array<Entity & { categoryId: string }>> {
    if (entityIds.length === 0) {
        return [];
    }

    const entities = await prisma.entity.findMany({
        where: { id: { in: entityIds } },
        include: {
            ...entityBlocksInclude,
            topic: {
                select: { categoryId: true },
            },
        },
    });

    const byId = new Map(entities.map((entity) => [entity.id, entity]));

    return entityIds.flatMap((id) => {
        const entity = byId.get(id);
        if (!entity) {
            return [];
        }

        return [
            {
                ...toEntityListItem(entity),
                categoryId: entity.topic.categoryId,
                blocks: entity.blocks.map((block) => toBlockResponse(block as BlockWithRows)),
            },
        ];
    });
}

function validateBlocks(input: SaveEntityInput) {
    if (input.blocks.length > MAX_ENTITY_BLOCKS) {
        throw badRequest(`Maximum ${MAX_ENTITY_BLOCKS} blocks allowed`);
    }

    const positions = input.blocks.map((block) => block.position);
    if (new Set(positions).size !== positions.length) {
        throw badRequest('Block positions must be unique');
    }
}

async function replaceBlocks(tx: Prisma.TransactionClient, entityId: string, blocks: SaveEntityInput['blocks']) {
    await tx.listBlockRow.deleteMany({
        where: { block: { entityId } },
    });
    await tx.entityBlock.deleteMany({ where: { entityId } });

    for (const block of blocks) {
        const createdBlock = await tx.entityBlock.create({
            data: {
                entityId,
                blockType: block.blockType as BlockType,
                position: block.position,
                contentJson:
                    block.blockType === 'text' || block.blockType === 'code' || block.blockType === 'list'
                        ? (block.contentJson as Prisma.InputJsonValue)
                        : undefined,
                mediaAssetId: block.blockType === 'image' ? block.mediaAssetId : undefined,
            },
        });

        if (block.blockType === 'list') {
            await tx.listBlockRow.createMany({
                data: block.rows.map((row, index) => ({
                    blockId: createdBlock.id,
                    position: index,
                    leftValue: row.leftValue,
                    rightValue: row.rightValue,
                })),
            });
        }
    }
}

export async function listEntities(
    user: AuthUser,
    categoryId: string,
    topicId: string,
    query: ListSearchQuery,
): Promise<EntityListPage> {
    await getTopicForUser(categoryId, topicId, user);

    const where = { topicId, ...textContainsFilter('title', query.search) };
    const [totalItems, entities] = await Promise.all([
        prisma.entity.count({ where }),
        prisma.entity.findMany({
            where,
            orderBy: { position: 'asc' },
            skip: getPaginationSkip(query),
            take: query.pageSize,
        }),
    ]);

    return toPaginatedResponse(entities.map(toEntityListItem), totalItems, query);
}

export async function getEntity(
    user: AuthUser,
    categoryId: string,
    topicId: string,
    entityId: string,
): Promise<Entity> {
    await getEntityForUser(categoryId, topicId, entityId, user);
    return loadEntityWithBlocks(entityId);
}

export async function getEntityById(user: AuthUser, entityId: string): Promise<Entity> {
    await getEntityByIdForUser(entityId, user);
    return loadEntityWithBlocks(entityId);
}

export async function createEntity(
    user: AuthUser,
    categoryId: string,
    topicId: string,
    input: SaveEntityInput,
): Promise<Entity> {
    await getTopicForUser(categoryId, topicId, user);
    validateBlocks(input);

    const maxPosition = await prisma.entity.aggregate({
        where: { topicId },
        _max: { position: true },
    });
    const position = (maxPosition._max.position ?? -1) + 1;

    const entity = await prisma.$transaction(async (tx) => {
        const created = await tx.entity.create({
            data: {
                topicId,
                title: input.title,
                position,
            },
        });

        await replaceBlocks(tx, created.id, input.blocks);
        return created;
    });

    return loadEntityWithBlocks(entity.id);
}

export async function updateEntity(
    user: AuthUser,
    categoryId: string,
    topicId: string,
    entityId: string,
    input: UpdateEntityInput,
): Promise<Entity> {
    await getEntityForUser(categoryId, topicId, entityId, user);

    if (input.blocks) {
        validateBlocks({
            title: input.title ?? 'placeholder',
            blocks: input.blocks,
        });
    }

    await prisma.$transaction(async (tx) => {
        await tx.entity.update({
            where: { id: entityId },
            data: {
                ...(input.title !== undefined ? { title: input.title } : {}),
                ...(input.visibility !== undefined ? { visibility: input.visibility } : {}),
            },
        });

        if (input.blocks) {
            await replaceBlocks(tx, entityId, input.blocks);
        }
    });

    return loadEntityWithBlocks(entityId);
}

export async function deleteEntity(
    user: AuthUser,
    categoryId: string,
    topicId: string,
    entityId: string,
): Promise<void> {
    await getEntityForUser(categoryId, topicId, entityId, user);

    const imageBlocks = await prisma.entityBlock.findMany({
        where: { entityId, mediaAssetId: { not: null } },
        select: { mediaAssetId: true },
    });
    const mediaAssetIds = [...new Set(imageBlocks.map((block) => block.mediaAssetId!))];

    await prisma.entity.delete({ where: { id: entityId } });

    await deleteMediaAssetsIfUnreferenced(mediaAssetIds);
}

export async function reviseEntity(
    user: AuthUser,
    categoryId: string,
    topicId: string,
    entityId: string,
): Promise<EntityListItem> {
    await getEntityForUser(categoryId, topicId, entityId, user);

    const entity = await prisma.entity.update({
        where: { id: entityId },
        data: { revisedCount: { increment: 1 } },
    });

    return toEntityListItem(entity);
}

export async function skipEntity(
    user: AuthUser,
    categoryId: string,
    topicId: string,
    entityId: string,
): Promise<EntityListItem> {
    await getEntityForUser(categoryId, topicId, entityId, user);

    const entity = await prisma.entity.update({
        where: { id: entityId },
        data: { skippedCount: { increment: 1 } },
    });

    return toEntityListItem(entity);
}

export { mediaUrl } from '../../lib/media-url.js';
