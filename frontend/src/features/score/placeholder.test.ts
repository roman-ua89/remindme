import { describe, expect, it } from 'vitest';

import { getTreeStage } from '@/features/score/placeholder';

describe('getTreeStage', () => {
    it.each([
        [0, 1],
        [1, 1],
        [2, 2],
        [3, 2],
        [4, 3],
        [5, 3],
        [6, 4],
        [7, 4],
        [8, 4],
        [9, 5],
        [10, 5],
        [11, 5],
        [12, 6],
        [13, 6],
        [14, 6],
        [15, 6],
    ])('maps %i drops to stage %i', (totalDrops, expectedStage) => {
        expect(getTreeStage(totalDrops)).toBe(expectedStage);
    });

    it('stays at stage 6 above 15 drops', () => {
        expect(getTreeStage(16)).toBe(6);
    });
});
