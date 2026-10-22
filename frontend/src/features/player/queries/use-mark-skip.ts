import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { markEntitySkip } from '@/features/player/api';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

type MarkSkipVariables = {
    categoryId: string;
    topicId: string;
    entityId: string;
};

export function useMarkSkip() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, topicId, entityId }: MarkSkipVariables) => markEntitySkip(categoryId, topicId, entityId),
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
