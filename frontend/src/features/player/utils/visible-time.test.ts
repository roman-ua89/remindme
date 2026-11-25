import { describe, expect, it } from 'vitest';

import { countGapMs, crossesDropMark } from '@/features/player/utils/visible-time';

describe('countGapMs', () => {
    it('counts a gap spent with the tab visible', () => {
        expect(countGapMs(1_000, true)).toBe(1_000);
    });

    it('drops a gap spent with the tab hidden', () => {
        expect(countGapMs(60_000, false)).toBe(0);
    });

    it('drops a sleep-sized gap (2 minutes or more) even when visible', () => {
        expect(countGapMs(119_999, true)).toBe(119_999);
        expect(countGapMs(120_000, true)).toBe(0);
    });

    it('drops empty and negative gaps', () => {
        expect(countGapMs(0, true)).toBe(0);
        expect(countGapMs(-500, true)).toBe(0);
    });

    it('counts only the visible seconds of 20 s visible followed by 60 s hidden', () => {
        const visibility = [...Array.from({ length: 20 }, () => true), ...Array.from({ length: 60 }, () => false)];
        const counted = visibility.reduce((sum, isVisible) => sum + countGapMs(1_000, isVisible), 0);
        expect(counted).toBe(20_000);
    });
});

describe('crossesDropMark', () => {
    it.each([
        [100, 130, false],
        [590, 610, true],
        [700, 720, false],
        [0, 1200, true],
    ])('from %i to %i s crosses a drop: %s', (before, after, expected) => {
        expect(crossesDropMark(before, after)).toBe(expected);
    });
});
