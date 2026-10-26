import { useMemo, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, format, isAfter, isSameMonth, parseISO, startOfMonth } from 'date-fns';

import { useDailyActivity } from '@/features/activity/queries/use-daily-activity';
import type { DailyActivityDay } from '@/features/activity/types';

export type ActivityMonthRow = DailyActivityDay & { day: number };

/** Month paging for the Home activity charts: one month at a time, back to the first month with any activity. */
export function useActivityMonth() {
    const [month, setMonth] = useState(() => startOfMonth(new Date()));
    const monthKey = format(month, 'yyyy-MM');
    const query = useDailyActivity(monthKey);
    const { data } = query;
    // Paging stops at the first month with any activity (empty months in between stay reachable).
    const earliestMonth = data?.firstActivityDate ? startOfMonth(parseISO(data.firstActivityDate)) : startOfMonth(new Date());

    // API returns only days with activity; zero-fill the rest so every day gets a slot.
    const rows = useMemo<Array<ActivityMonthRow>>(() => {
        const byDate = new Map((data?.month === monthKey ? data.days : []).map((day) => [day.date, day]));
        return eachDayOfInterval({ start: month, end: endOfMonth(month) }).map((date) => {
            const key = format(date, 'yyyy-MM-dd');
            const day = byDate.get(key);
            return {
                date: key,
                day: date.getDate(),
                revisedCount: day?.revisedCount ?? 0,
                skippedCount: day?.skippedCount ?? 0,
                playerSeconds: day?.playerSeconds ?? 0,
            };
        });
    }, [data, month, monthKey]);

    return {
        month,
        rows,
        query,
        canGoPrev: isAfter(month, earliestMonth) && !query.isPlaceholderData,
        canGoNext: !isSameMonth(month, new Date()),
        goPrev: () => setMonth((current) => addMonths(current, -1)),
        goNext: () => setMonth((current) => addMonths(current, 1)),
    };
}
