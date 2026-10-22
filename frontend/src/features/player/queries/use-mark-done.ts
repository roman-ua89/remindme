import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { markEntityDone } from '@/features/player/api';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

type MarkDoneVariables = {
    categoryId: string;
    topicId: string;
    entityId: string;
};

export function useMarkDone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, topicId, entityId }: MarkDoneVariables) => markEntityDone(categoryId, topicId, entityId),
        onSuccess: (_data, { categoryId, topicId }) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.entities.all(categoryId, topicId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.topics.detail(categoryId, topicId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.topics.all(categoryId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.categories.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.activity.all,
            });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
