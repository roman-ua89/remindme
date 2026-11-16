import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { updateEntity } from '@/features/entities/api';
import type { SaveEntityPayload } from '@/features/entities/types';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

export function useUpdateEntity(categoryId: string, topicId: string, entityId: string) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: SaveEntityPayload) => updateEntity(categoryId, topicId, entityId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.entities.all(categoryId, topicId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.entities.detail(categoryId, topicId, entityId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.topics.detail(categoryId, topicId),
            });
            navigate({
                to: '/categories/$categoryId/topics/$topicId',
                params: { categoryId, topicId },
            });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
