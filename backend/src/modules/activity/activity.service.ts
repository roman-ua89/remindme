import type { DailyActivityDay, DailyActivityResponse } from '@remindme/contracts/activity';

import type { AuthUser } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

function toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function toDailyActivityDayDto(row: { activityDate: Date; revisedCount: number; skippedCount: number }): DailyActivityDay {
    return {
        date: toDateString(row.activityDate),
        revisedCount: row.revisedCount,
        skippedCount: row.skippedCount,
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
            select: { activityDate: true, revisedCount: true, skippedCount: true },
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
