import { fetchPlayerBatch } from '@/features/player/api'
import { PLAYER_BATCH_SIZE } from '@/features/player/constants'
import type {
    PlayerBatchItem,
    PlayerBatchProgress,
    PlayerScope,
    PlayerSessionState,
} from '@/features/player/types'

export type FetchNextBatchResult = {
    items: PlayerBatchItem[]
    shownEntityIds: string[]
    depleted: boolean
}

export function resetRound(session: PlayerSessionState): PlayerSessionState {
    return {
        ...session,
        shownEntityIds: [],
    }
}

export function createEmptySession(): PlayerSessionState {
    return {
        queue: [],
        shownEntityIds: [],
        batchTotal: 0,
        completedInBatch: 0,
        status: 'loading',
    }
}

export function getBatchProgress(session: PlayerSessionState): PlayerBatchProgress {
    return {
        completedInBatch: session.completedInBatch,
        batchTotal: session.batchTotal,
        remainingInBatch: session.queue.length,
        value: session.batchTotal === 0 ? 0 : (session.completedInBatch / session.batchTotal) * 100,
    }
}

export function applyBatch(session: PlayerSessionState, result: FetchNextBatchResult): PlayerSessionState {
    const base = result.shownEntityIds.length === 0 ? resetRound(session) : session

    if (result.depleted) {
        return {
            ...base,
            queue: [],
            shownEntityIds: [],
            batchTotal: 0,
            completedInBatch: 0,
            status: 'depleted',
        }
    }

    return {
        ...base,
        queue: result.items,
        shownEntityIds: result.shownEntityIds,
        batchTotal: result.items.length,
        completedInBatch: 0,
        status: 'playing',
    }
}

export function advanceAfterAction(session: PlayerSessionState, entityId: string): PlayerSessionState {
    const nextQueue = session.queue.filter((item) => item.id !== entityId)
    const shownEntityIds = [...session.shownEntityIds, entityId]
    const completedInBatch = session.completedInBatch + 1

    if (nextQueue.length === 0) {
        return {
            ...session,
            queue: [],
            shownEntityIds,
            completedInBatch,
            status: 'batchComplete',
        }
    }

    return {
        ...session,
        queue: nextQueue,
        shownEntityIds,
        completedInBatch,
        status: 'playing',
    }
}

/**
 * Fetch a pack and run the round-reset rule: an empty response with leftover
 * shown ids means the round is complete — clear excludes and retry once.
 */
export async function fetchNextBatch(input: {
    scope: PlayerScope
    shownEntityIds: string[]
    limit?: number
}): Promise<FetchNextBatchResult> {
    const limit = input.limit ?? PLAYER_BATCH_SIZE
    const first = await fetchPlayerBatch({
        scope: input.scope,
        excludeEntityIds: input.shownEntityIds,
        limit,
    })

    if (first.items.length > 0) {
        return {
            items: first.items,
            shownEntityIds: input.shownEntityIds,
            depleted: false,
        }
    }

    if (input.shownEntityIds.length === 0) {
        return {
            items: [],
            shownEntityIds: [],
            depleted: true,
        }
    }

    const nextRound = await fetchPlayerBatch({
        scope: input.scope,
        excludeEntityIds: [],
        limit,
    })

    if (nextRound.items.length === 0) {
        return {
            items: [],
            shownEntityIds: [],
            depleted: true,
        }
    }

    return {
        items: nextRound.items,
        shownEntityIds: [],
        depleted: false,
    }
}
