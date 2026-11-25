import { describe, expect, it } from 'vitest';

import { getTreeStage } from '@/features/score/get-tree-stage';

describe('getTreeStage', () => {
    it.each([
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 2],
        [5, 2],
        [6, 3],
        [8, 3],
        [9, 4],
        [11, 4],
        [12, 5],
        [14, 5],
        [15, 6],
    ])('maps %i drops to stage %i', (totalDrops, expectedStage) => {
        expect(getTreeStage(totalDrops)).toBe(expectedStage);
    });

    it('stays at stage 6 above 15 drops', () => {
        expect(getTreeStage(16)).toBe(6);
        expect(getTreeStage(100)).toBe(6);
    });
});
