import type { DailyActivityDay, DailyActivityResponse, TodayActivityResponse } from '@remindme/contracts/activity';

import type { AuthUser } from '../../middleware/auth.js';
import { recordPlayerSeconds, resolveActivityDate } from '../../lib/daily-activity.js';
import { prisma } from '../../lib/prisma.js';

const dailyActivitySelect = {
    activityDate: true,
    revisedCount: true,
    skippedCount: true,
    playerSeconds: true,
} as const;

type DailyActivityRow = { activityDate: Date; revisedCount: number; skippedCount: number; playerSeconds: number };

function toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function toDailyActivityDayDto(row: DailyActivityRow): DailyActivityDay {
    return {
        date: toDateString(row.activityDate),
        revisedCount: row.revisedCount,
        skippedCount: row.skippedCount,
        playerSeconds: row.playerSeconds,
    };
}

export async function getDailyActivity(user: AuthUser, month: string): Promise<DailyActivityResponse> {
    const [year, monthIndex] = month.split('-').map(Number);
    const from = new Date(Date.UTC(year, monthIndex - 1, 1));
    const to = new Date(Date.UTC(year, monthIndex, 1));

    const [rows, first] = await Promise.all([
        prisma.userDailyActivity.findMany({
            where: { userId: user.id, activityDate: { gte: from, lt: to } },
            orderBy: { activityDate: 'asc' },
            select: dailyActivitySelect,
        }),
        prisma.userDailyActivity.findFirst({
            where: { userId: user.id },
            orderBy: { activityDate: 'asc' },
            select: { activityDate: true },
        }),
    ]);

    return {
        month,
        days: rows.map(toDailyActivityDayDto),
        firstActivityDate: first ? toDateString(first.activityDate) : null,
    };
}

export async function getTodayActivity(user: AuthUser, timeZone: string | undefined): Promise<TodayActivityResponse> {
    const activityDate = resolveActivityDate(timeZone);
    const row = await prisma.userDailyActivity.findUnique({
        where: { userId_activityDate: { userId: user.id, activityDate } },
        select: dailyActivitySelect,
    });

    return toDailyActivityDayDto(row ?? { activityDate, revisedCount: 0, skippedCount: 0, playerSeconds: 0 });
}

export async function recordPlayerTime(
    user: AuthUser,
    seconds: number,
    timeZone: string | undefined,
): Promise<TodayActivityResponse> {
    const row = await recordPlayerSeconds(prisma, user.id, resolveActivityDate(timeZone), seconds);
    return toDailyActivityDayDto(row);
}
