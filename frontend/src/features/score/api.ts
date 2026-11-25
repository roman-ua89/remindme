import type { ScoreResponse } from '@remindme/contracts/score';

import { apiClient } from '@/lib/api-client';

/** The logged-in user's drops and level; the server takes "today" from the `X-Timezone` header. */
export async function getScore(): Promise<ScoreResponse> {
    const { data } = await apiClient.get<ScoreResponse>('/activity/score');
    return data;
}
