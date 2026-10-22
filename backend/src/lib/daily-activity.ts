import type { Prisma } from '@prisma/client';

/** Request header carrying the client's IANA timezone (e.g. `Europe/Kyiv`). */
export const TIMEZONE_HEADER = 'X-Timezone';

export type DailyActivityKind = 'revised' | 'skipped';

function isValidTimeZone(timeZone: string): boolean {
    try {
        new Intl.DateTimeFormat('en-US', { timeZone });
        return true;
    } catch {
        return false;
    }
}

/**
 * Today's calendar day in the given timezone as a UTC-midnight Date (what Prisma expects for `@db.Date`).
 * Missing or invalid timezones fall back to UTC.
 */
export function resolveActivityDate(timeZone: string | undefined, now = new Date()): Date {
    const zone = timeZone && isValidTimeZone(timeZone) ? timeZone : 'UTC';
    // en-CA formats as YYYY-MM-DD
    const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    return new Date(`${ymd}T00:00:00.000Z`);
}

export async function recordDailyActivity(
    tx: Prisma.TransactionClient,
    userId: string,
    activityDate: Date,
    kind: DailyActivityKind,
): Promise<void> {
    const field = kind === 'revised' ? 'revisedCount' : 'skippedCount';

    await tx.userDailyActivity.upsert({
        where: { userId_activityDate: { userId, activityDate } },
        create: { userId, activityDate, [field]: 1 },
        update: { [field]: { increment: 1 } },
    });
}
