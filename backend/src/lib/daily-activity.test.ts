import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveActivityDate } from './daily-activity.js';

// 2026-11-15 23:30 UTC: still 15 Nov in UTC and New York (UTC-5 after DST ends), already 16 Nov in Kyiv (UTC+2 in November).
const LATE_UTC = new Date('2026-11-15T23:30:00.000Z');

describe('resolveActivityDate', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('uses the UTC calendar day when no timezone is given', () => {
        expect(resolveActivityDate(undefined, LATE_UTC).toISOString()).toBe('2026-11-15T00:00:00.000Z');
    });

    it('uses the local calendar day in the given timezone', () => {
        expect(resolveActivityDate('Europe/Kyiv', LATE_UTC).toISOString()).toBe('2026-11-16T00:00:00.000Z');
        expect(resolveActivityDate('America/New_York', LATE_UTC).toISOString()).toBe('2026-11-15T00:00:00.000Z');
    });

    it('switches to the next local day exactly at local midnight', () => {
        // 2026-11-16 00:00 in Kyiv (UTC+2) is 2026-11-15 22:00 UTC
        expect(resolveActivityDate('Europe/Kyiv', new Date('2026-11-15T21:59:59.999Z')).toISOString()).toBe(
            '2026-11-15T00:00:00.000Z',
        );
        expect(resolveActivityDate('Europe/Kyiv', new Date('2026-11-15T22:00:00.000Z')).toISOString()).toBe(
            '2026-11-16T00:00:00.000Z',
        );
    });

    it('falls back to the UTC day for an unknown timezone', () => {
        expect(resolveActivityDate('Not/A_Zone', LATE_UTC).toISOString()).toBe('2026-11-15T00:00:00.000Z');
    });

    it('falls back to the UTC day for an empty timezone', () => {
        expect(resolveActivityDate('', LATE_UTC).toISOString()).toBe('2026-11-15T00:00:00.000Z');
    });

    it('defaults to the current time when no instant is given', () => {
        vi.useFakeTimers();
        vi.setSystemTime(LATE_UTC);

        expect(resolveActivityDate('Europe/Kyiv').toISOString()).toBe('2026-11-16T00:00:00.000Z');
    });
});
