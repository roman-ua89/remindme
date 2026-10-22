import type { DailyActivityResponse } from '@remindme/contracts/activity';

import { apiClient } from '@/lib/api-client';

/** `month` is `YYYY-MM`. */
export async function getDailyActivity(month: string): Promise<DailyActivityResponse> {
    const { data } = await apiClient.get<DailyActivityResponse>('/activity/daily', { params: { month } });
    return data;
}
