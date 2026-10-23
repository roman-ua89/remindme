import type { LibraryStatsResponse } from '@remindme/contracts/stats';

import { apiClient } from '@/lib/api-client';

export async function getLibraryStats(): Promise<LibraryStatsResponse> {
    const { data } = await apiClient.get<LibraryStatsResponse>('/stats/library');
    return data;
}
