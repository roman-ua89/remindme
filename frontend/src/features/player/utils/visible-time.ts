import { SECONDS_PER_DROP } from '@remindme/contracts/score';

/** A longer gap between ticks means the machine slept (or the page sat in bfcache); that time isn't counted. */
const SLEEP_GAP_MS = 2 * 60_000;

/** Milliseconds of a tick gap that count as Player time: only while the tab is visible, and never a sleep-sized gap. */
export function countGapMs(gapMs: number, isVisible: boolean): number {
    return isVisible && gapMs > 0 && gapMs < SLEEP_GAP_MS ? gapMs : 0;
}

/** True when a report takes today's total across a whole drop (every `SECONDS_PER_DROP`). */
export function crossesDropMark(beforeSeconds: number, afterSeconds: number): boolean {
    return Math.floor(afterSeconds / SECONDS_PER_DROP) > Math.floor(beforeSeconds / SECONDS_PER_DROP);
}
