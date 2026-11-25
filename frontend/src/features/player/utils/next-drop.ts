import { SECONDS_PER_DROP } from '@remindme/contracts/score';

export type NextDrop = { status: 'waiting'; minutesLeft: number } | { status: 'capped'; maxPerDay: number };

/**
 * The Player top bar's drop hint for today's Player `seconds`: the minutes left to the next full 10 minutes,
 * or the daily cap once `maxPerDay` drops are earned.
 */
export function getNextDrop(seconds: number, maxPerDay: number): NextDrop {
    const dropsEarned = Math.min(Math.floor(seconds / SECONDS_PER_DROP), maxPerDay);
    if (dropsEarned >= maxPerDay) {
        return { status: 'capped', maxPerDay };
    }

    const secondsIntoDrop = seconds % SECONDS_PER_DROP;
    return { status: 'waiting', minutesLeft: Math.ceil((SECONDS_PER_DROP - secondsIntoDrop) / 60) };
}
