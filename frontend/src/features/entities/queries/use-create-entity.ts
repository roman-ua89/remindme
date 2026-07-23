import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { createEntity } from '@/features/entities/api';
import type { SaveEntityPayload } from '@/features/entities/types';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

export function useCreateEntity(categoryId: string, topicId: string) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: SaveEntityPayload) => createEntity(categoryId, topicId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.entities.all(categoryId, topicId),
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
