import type { DailyActivityResponse, RecordPlayerTimeBody, TodayActivityResponse } from '@remindme/contracts/activity';

import { API_BASE_URL, CLIENT_TIME_ZONE, apiClient } from '@/lib/api-client';

/** `month` is `YYYY-MM`. */
export async function getDailyActivity(month: string): Promise<DailyActivityResponse> {
    const { data } = await apiClient.get<DailyActivityResponse>('/activity/daily', { params: { month } });
    return data;
}

export async function getTodayActivity(): Promise<TodayActivityResponse> {
    const { data } = await apiClient.get<TodayActivityResponse>('/activity/today');
    return data;
}

/** Adds `seconds` (1..300) of Player time to today's total; returns today's counters. */
export async function recordPlayerTime(seconds: number): Promise<TodayActivityResponse> {
    const { data } = await apiClient.post<TodayActivityResponse>('/activity/player-time', { seconds } satisfies RecordPlayerTimeBody);
    return data;
}

/**
 * Same as `recordPlayerTime`, but survives page unload (reload, tab close) via `fetch` keepalive — axios can't do that.
 * Never rejects: there is nobody left to handle the error.
 */
export async function recordPlayerTimeKeepalive(seconds: number): Promise<void> {
    try {
        await fetch(`${API_BASE_URL}/activity/player-time`, {
            method: 'POST',
            keepalive: true,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'X-Timezone': CLIENT_TIME_ZONE },
            body: JSON.stringify({ seconds } satisfies RecordPlayerTimeBody),
        });
    } catch {
        // Lost report: at most one flush interval of Player time.
    }
}
