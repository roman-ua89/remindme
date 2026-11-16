import type { PlayerBatchItem } from '@remindme/contracts/player';

export type { PlayerBatchItem, PlayerApiScope, PlayerBatchRequest, PlayerBatchResponse } from '@remindme/contracts/player';

export type PlayerCategoryScope = {
    type: 'category';
    categoryId: string;
};

export type PlayerTopicScope = {
    type: 'topic';
    topicId: string;
};

export type PlayerEntityScope = {
    type: 'entity';
    entityId: string;
    preview?: boolean;
};

export type PlayerScope = PlayerCategoryScope | PlayerTopicScope | PlayerEntityScope;

export type PlayerSessionStatus = 'loading' | 'playing' | 'batchComplete' | 'depleted' | 'error';

export type PlayerSessionState = {
    queue: PlayerBatchItem[];
    shownEntityIds: string[];
    batchTotal: number;
    completedInBatch: number;
    status: PlayerSessionStatus;
};

export type PlayerBatchProgress = {
    completedInBatch: number;
    batchTotal: number;
    remainingInBatch: number;
    value: number;
};
