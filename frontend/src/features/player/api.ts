import type { EntityListItem } from '@remindme/contracts/entities'
import type { PlayerApiScope, PlayerBatchRequest, PlayerBatchResponse } from '@remindme/contracts/player'

import { apiClient } from '@/lib/api-client'
import { PLAYER_BATCH_SIZE } from '@/features/player/constants'
import type { PlayerScope } from '@/features/player/types'

export function toPlayerApiScope(scope: PlayerScope): PlayerApiScope {
    switch (scope.type) {
        case 'category':
            return { type: 'category', categoryId: scope.categoryId }
        case 'topic':
            return { type: 'topic', topicId: scope.topicId }
        case 'entity':
            return { type: 'entity', entityId: scope.entityId }
    }
}

export async function fetchPlayerBatch(input: {
    scope: PlayerScope
    excludeEntityIds: string[]
    limit?: number
}): Promise<PlayerBatchResponse> {
    const payload: PlayerBatchRequest = {
        scope: toPlayerApiScope(input.scope),
        excludeEntityIds: input.excludeEntityIds,
        limit: input.limit ?? PLAYER_BATCH_SIZE,
    }

    const { data } = await apiClient.post<PlayerBatchResponse>('/player/batch', payload)
    return data
}

export async function markEntityDone(
    categoryId: string,
    topicId: string,
    entityId: string,
): Promise<EntityListItem> {
    const { data } = await apiClient.patch<EntityListItem>(
        `/categories/${categoryId}/topics/${topicId}/entities/${entityId}/revise`,
    )
    return data
}

export async function markEntitySkip(
    categoryId: string,
    topicId: string,
    entityId: string,
): Promise<EntityListItem> {
    const { data } = await apiClient.patch<EntityListItem>(
        `/categories/${categoryId}/topics/${topicId}/entities/${entityId}/skip`,
    )
    return data
}
