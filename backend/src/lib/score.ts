import {
    DROPS_PER_LEVEL,
    MAX_DROPS_PER_DAY,
    MAX_LEVEL,
    SECONDS_PER_DROP,
    type ScoreResponse,
} from '@remindme/contracts/score';

/** First local day that counts. Player time before it earns no drops and causes no decay. */
export const SCORE_LAUNCH_DATE = '2026-11-25';

const DAY_MS = 24 * 60 * 60 * 1000;

function dropsForSeconds(playerSeconds: number): number {
    return Math.min(Math.floor(playerSeconds / SECONDS_PER_DROP), MAX_DROPS_PER_DAY);
}

function levelForDrops(totalDrops: number): number {
    return Math.min(Math.floor(totalDrops / DROPS_PER_LEVEL) + 1, MAX_LEVEL);
}

/**
 * Score from a user's daily Player time. Pure: the caller loads the rows.
 *
 * `activityDate` and `today` are UTC-midnight Dates (as `resolveActivityDate` returns them). Rows before
 * `SCORE_LAUNCH_DATE` or after `today` are ignored. The walk starts at the first counted day with Player time and
 * steps through yesterday: a day with drops adds them, an idle day (0 drops, missing rows included) takes one away,
 * floor 0. Today adds its drops and never decays.
 */
export function computeScore(days: { activityDate: Date; playerSeconds: number }[], today: Date): ScoreResponse {
    const launchMs = Date.parse(`${SCORE_LAUNCH_DATE}T00:00:00.000Z`);
    const todayMs = today.getTime();

    const secondsByDay = new Map<number, number>();
    for (const row of days) {
        const ms = row.activityDate.getTime();
        if (ms >= launchMs && ms <= todayMs) {
            secondsByDay.set(ms, row.playerSeconds);
        }
    }

    let walkStartMs: number | null = null;
    for (const [ms, seconds] of secondsByDay) {
        if (seconds > 0 && (walkStartMs === null || ms < walkStartMs)) {
            walkStartMs = ms;
        }
    }

    let totalDrops = 0;
    let lastActiveLevel: number | null = null;

    if (walkStartMs !== null) {
        for (let ms = walkStartMs; ms < todayMs; ms += DAY_MS) {
            const drops = dropsForSeconds(secondsByDay.get(ms) ?? 0);
            if (drops > 0) {
                totalDrops += drops;
                lastActiveLevel = levelForDrops(totalDrops);
            } else {
                totalDrops = Math.max(0, totalDrops - 1);
            }
        }
    }

    const earnedToday = dropsForSeconds(secondsByDay.get(todayMs) ?? 0);
    totalDrops += earnedToday;
    const level = levelForDrops(totalDrops);

    return {
        totalDrops,
        level,
        treeStage: level,
        sunGradation: Math.ceil(level / 2),
        earnedToday,
        maxPerDay: MAX_DROPS_PER_DAY,
        levelLost: earnedToday === 0 && lastActiveLevel !== null && level < lastActiveLevel,
    };
}
