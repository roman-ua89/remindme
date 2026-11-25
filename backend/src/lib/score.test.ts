import { describe, expect, it } from 'vitest';
import { computeScore, SCORE_LAUNCH_DATE } from './score.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const LAUNCH_MS = Date.parse(`${SCORE_LAUNCH_DATE}T00:00:00.000Z`);

/** UTC-midnight Date for the local day `offset` days after the launch date (negative: before it). */
const day = (offset: number): Date => new Date(LAUNCH_MS + offset * DAY_MS);
const minutes = (count: number): number => count * 60;

describe('computeScore', () => {
    it('starts at level 1 with 0 drops when there is no history', () => {
        expect(computeScore([], day(1))).toEqual({
            totalDrops: 0,
            level: 1,
            treeStage: 1,
            sunGradation: 1,
            earnedToday: 0,
            maxPerDay: 3,
            levelLost: false,
        });
    });

    it('caps a past day at 3 drops', () => {
        expect(computeScore([{ activityDate: day(0), playerSeconds: minutes(120) }], day(1))).toMatchObject({
            totalDrops: 3,
            level: 2,
            earnedToday: 0,
        });
    });

    it('caps today at 3 drops', () => {
        expect(computeScore([{ activityDate: day(0), playerSeconds: minutes(120) }], day(0))).toMatchObject({
            totalDrops: 3,
            level: 2,
            earnedToday: 3,
        });
    });

    it('counts only whole 10-minute blocks and loses the remainder at midnight', () => {
        const days = [
            { activityDate: day(0), playerSeconds: 1199 },
            { activityDate: day(1), playerSeconds: 1199 },
        ];

        expect(computeScore(days, day(2))).toMatchObject({ totalDrops: 2, level: 1 });
    });

    it('decays a 9-minute day by 1 and earns nothing for it', () => {
        const days = [
            { activityDate: day(0), playerSeconds: minutes(20) },
            { activityDate: day(1), playerSeconds: minutes(9) },
        ];

        expect(computeScore(days, day(2))).toMatchObject({ totalDrops: 1, level: 1, levelLost: false });
    });

    it('decays 1 drop for each missing day between rows', () => {
        const days = [
            { activityDate: day(0), playerSeconds: minutes(30) },
            { activityDate: day(3), playerSeconds: minutes(30) },
        ];

        expect(computeScore(days, day(4))).toMatchObject({ totalDrops: 4, level: 2 });
    });

    it('stops decay at 0 drops', () => {
        expect(computeScore([{ activityDate: day(0), playerSeconds: minutes(20) }], day(30))).toMatchObject({
            totalDrops: 0,
            level: 1,
            levelLost: false,
        });
    });

    it('keeps counting drops past 15 while the level stays at 6', () => {
        const days = [0, 1, 2, 3, 4, 5].map((offset) => ({ activityDate: day(offset), playerSeconds: minutes(30) }));

        expect(computeScore(days, day(5))).toMatchObject({
            totalDrops: 18,
            level: 6,
            treeStage: 6,
            sunGradation: 3,
            earnedToday: 3,
        });
    });

    it('never decays today', () => {
        const days = [
            { activityDate: day(0), playerSeconds: minutes(30) },
            { activityDate: day(1), playerSeconds: minutes(9) },
        ];

        expect(computeScore(days, day(1))).toMatchObject({ totalDrops: 3, level: 2, earnedToday: 0, levelLost: false });
    });

    it('ignores rows before SCORE_LAUNCH_DATE', () => {
        const days = [
            { activityDate: day(-1), playerSeconds: minutes(120) },
            { activityDate: day(0), playerSeconds: minutes(20) },
        ];

        expect(computeScore(days, day(0))).toMatchObject({ totalDrops: 2, level: 1, earnedToday: 2 });
    });

    it('sets levelLost when decay has lowered the level and today has no drop', () => {
        const days = [
            { activityDate: day(0), playerSeconds: minutes(30) },
            { activityDate: day(1), playerSeconds: minutes(9) },
        ];

        expect(computeScore(days, day(2))).toMatchObject({ totalDrops: 2, level: 1, earnedToday: 0, levelLost: true });
    });

    it('clears levelLost once today earns a drop', () => {
        const days = [
            { activityDate: day(0), playerSeconds: minutes(30) },
            { activityDate: day(1), playerSeconds: minutes(9) },
            { activityDate: day(2), playerSeconds: minutes(9) },
            { activityDate: day(3), playerSeconds: minutes(10) },
        ];

        expect(computeScore(days, day(3))).toMatchObject({ totalDrops: 2, level: 1, earnedToday: 1, levelLost: false });
    });

    it('leaves levelLost off when no decay has lowered the level', () => {
        expect(computeScore([{ activityDate: day(0), playerSeconds: minutes(30) }], day(1))).toMatchObject({
            totalDrops: 3,
            level: 2,
            levelLost: false,
        });
    });

    it('matches the worked example in docs/score-progression.md §2', () => {
        // Mon 25 min, Tue 45 min, Wed 0, Thu 9 min, Fri 30 min; today is Fri.
        const days = [
            { activityDate: day(0), playerSeconds: minutes(25) },
            { activityDate: day(1), playerSeconds: minutes(45) },
            { activityDate: day(2), playerSeconds: 0 },
            { activityDate: day(3), playerSeconds: minutes(9) },
            { activityDate: day(4), playerSeconds: minutes(30) },
        ];

        expect(computeScore(days, day(4))).toEqual({
            totalDrops: 6,
            level: 3,
            treeStage: 3,
            sunGradation: 2,
            earnedToday: 3,
            maxPerDay: 3,
            levelLost: false,
        });
    });
});
