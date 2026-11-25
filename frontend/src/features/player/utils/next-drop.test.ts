import { describe, expect, it } from 'vitest';

import { getNextDrop } from '@/features/player/utils/next-drop';

describe('getNextDrop', () => {
    it.each([
        [0, 10],
        [599, 1],
        [600, 10],
        [1799, 1],
    ])('at %i s of Player time the next drop is in %i min', (seconds, minutesLeft) => {
        expect(getNextDrop(seconds, 3)).toEqual({ status: 'waiting', minutesLeft });
    });

    it.each([1800, 3600, 7200])('at %i s the daily cap of 3 is reached', (seconds) => {
        expect(getNextDrop(seconds, 3)).toEqual({ status: 'capped', maxPerDay: 3 });
    });

    it('reaches the cap at a lower maxPerDay', () => {
        expect(getNextDrop(599, 1)).toEqual({ status: 'waiting', minutesLeft: 1 });
        expect(getNextDrop(600, 1)).toEqual({ status: 'capped', maxPerDay: 1 });
        expect(getNextDrop(1199, 2)).toEqual({ status: 'waiting', minutesLeft: 1 });
        expect(getNextDrop(1200, 2)).toEqual({ status: 'capped', maxPerDay: 2 });
    });
});
