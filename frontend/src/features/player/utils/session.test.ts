import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPlayerBatch } from '@/features/player/api';
import { PLAYER_BATCH_SIZE } from '@/features/player/constants';
import type { PlayerBatchItem, PlayerScope, PlayerSessionState } from '@/features/player/types';
import { advanceAfterAction, applyBatch, createEmptySession, fetchNextBatch, getBatchProgress, resetRound } from '@/features/player/utils/session';

vi.mock('@/features/player/api', () => ({
    fetchPlayerBatch: vi.fn(),
}));

const fetchMock = vi.mocked(fetchPlayerBatch);

const CATEGORY_ID = '6f1c2b8e-9a4d-4c3e-8f2a-1b2c3d4e5f60';
const TOPIC_ID = '9b8c7d6e-5f4a-4b3c-8d2e-1f0a9b8c7d6e';
const scope: PlayerScope = { type: 'topic', topicId: TOPIC_ID };

function makeItem(id: string): PlayerBatchItem {
    return {
        id,
        topicId: TOPIC_ID,
        title: `Entity ${id}`,
        revisedCount: 0,
        skippedCount: 0,
        visibility: 'included',
        marker: null,
        position: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        editedAt: null,
        blocks: [],
        categoryId: CATEGORY_ID,
        categoryName: 'Biology',
        topicName: 'Cells',
    };
}

function makeSession(overrides: Partial<PlayerSessionState> = {}): PlayerSessionState {
    return {
        queue: [],
        shownEntityIds: [],
        batchTotal: 0,
        completedInBatch: 0,
        status: 'playing',
        ...overrides,
    };
}

describe('createEmptySession', () => {
    it('starts in loading with nothing queued or shown', () => {
        expect(createEmptySession()).toStrictEqual({
            queue: [],
            shownEntityIds: [],
            batchTotal: 0,
            completedInBatch: 0,
            status: 'loading',
        });
    });
});

describe('resetRound', () => {
    it('clears shown ids and keeps everything else', () => {
        const session = makeSession({ queue: [makeItem('e3')], shownEntityIds: ['e1', 'e2'], batchTotal: 3, completedInBatch: 2 });

        expect(resetRound(session)).toStrictEqual({ ...session, shownEntityIds: [] });
    });
});

describe('getBatchProgress', () => {
    it('reports the completed share of the batch', () => {
        const session = makeSession({ queue: [makeItem('e3'), makeItem('e4')], batchTotal: 4, completedInBatch: 1 });

        expect(getBatchProgress(session)).toStrictEqual({ completedInBatch: 1, batchTotal: 4, remainingInBatch: 2, value: 25 });
    });

    it('reports zero progress for an empty batch', () => {
        expect(getBatchProgress(makeSession())).toStrictEqual({ completedInBatch: 0, batchTotal: 0, remainingInBatch: 0, value: 0 });
    });
});

describe('applyBatch', () => {
    it('starts playing the new pack and keeps the shown ids', () => {
        const session = makeSession({ status: 'loading', shownEntityIds: ['e0'] });

        const result = applyBatch(session, { items: [makeItem('e1'), makeItem('e2')], shownEntityIds: ['e0'], depleted: false });

        expect(result).toMatchObject({
            status: 'playing',
            queue: [makeItem('e1'), makeItem('e2')],
            shownEntityIds: ['e0'],
            batchTotal: 2,
            completedInBatch: 0,
        });
    });

    it('clears the shown ids when a new round starts', () => {
        const session = makeSession({ shownEntityIds: ['e1', 'e2'] });

        const result = applyBatch(session, { items: [makeItem('e3')], shownEntityIds: [], depleted: false });

        expect(result).toMatchObject({ status: 'playing', queue: [makeItem('e3')], shownEntityIds: [], batchTotal: 1 });
    });

    it('marks the session depleted and empties the pack', () => {
        const session = makeSession({ queue: [makeItem('e1')], shownEntityIds: ['e0'], batchTotal: 1 });

        const result = applyBatch(session, { items: [], shownEntityIds: [], depleted: true });

        expect(result).toStrictEqual({ queue: [], shownEntityIds: [], batchTotal: 0, completedInBatch: 0, status: 'depleted' });
    });
});

describe('advanceAfterAction', () => {
    it('removes the entity from the queue and keeps playing while items remain', () => {
        const session = makeSession({ queue: [makeItem('e1'), makeItem('e2'), makeItem('e3')], batchTotal: 3 });

        const result = advanceAfterAction(session, 'e2');

        expect(result).toMatchObject({
            status: 'playing',
            queue: [makeItem('e1'), makeItem('e3')],
            shownEntityIds: ['e2'],
            completedInBatch: 1,
            batchTotal: 3,
        });
    });

    it('ends the batch once the last queued entity is handled', () => {
        const session = makeSession({ queue: [makeItem('e1')], shownEntityIds: ['e0'], batchTotal: 2, completedInBatch: 1 });

        const result = advanceAfterAction(session, 'e1');

        expect(result).toMatchObject({ status: 'batchComplete', queue: [], shownEntityIds: ['e0', 'e1'], completedInBatch: 2 });
    });
});

describe('fetchNextBatch', () => {
    beforeEach(() => {
        fetchMock.mockReset();
    });

    it('returns the pack and keeps the current exclusions', async () => {
        fetchMock.mockResolvedValueOnce({ items: [makeItem('e3')] });

        const result = await fetchNextBatch({ scope, shownEntityIds: ['e1', 'e2'] });

        expect(result).toStrictEqual({ items: [makeItem('e3')], shownEntityIds: ['e1', 'e2'], depleted: false });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith({ scope, excludeEntityIds: ['e1', 'e2'], limit: PLAYER_BATCH_SIZE });
    });

    it('reports depleted when nothing is left and nothing was shown', async () => {
        fetchMock.mockResolvedValueOnce({ items: [] });

        const result = await fetchNextBatch({ scope, shownEntityIds: [] });

        expect(result).toStrictEqual({ items: [], shownEntityIds: [], depleted: true });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('starts a new round when an empty pack follows shown entities', async () => {
        fetchMock.mockResolvedValueOnce({ items: [] }).mockResolvedValueOnce({ items: [makeItem('e4')] });

        const result = await fetchNextBatch({ scope, shownEntityIds: ['e1', 'e2'] });

        expect(result).toStrictEqual({ items: [makeItem('e4')], shownEntityIds: [], depleted: false });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenLastCalledWith({ scope, excludeEntityIds: [], limit: PLAYER_BATCH_SIZE });
    });

    it('reports depleted when the new round is empty too', async () => {
        fetchMock.mockResolvedValue({ items: [] });

        const result = await fetchNextBatch({ scope, shownEntityIds: ['e1'] });

        expect(result).toStrictEqual({ items: [], shownEntityIds: [], depleted: true });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
