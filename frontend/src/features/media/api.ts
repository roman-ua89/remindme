import type { MediaAsset } from '@remindme/contracts/media';

import { apiClient } from '@/lib/api-client';

export async function uploadMedia(file: File): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<MediaAsset>('/media/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return data;
}
