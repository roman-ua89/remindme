import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteEntity } from '@/features/entities/api';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

type DeleteEntityVariables = {
    entityId: string;
};

export function useDeleteEntity(categoryId: string, topicId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ entityId }: DeleteEntityVariables) => deleteEntity(categoryId, topicId, entityId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.entities.all(categoryId, topicId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.topics.detail(categoryId, topicId),
            });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
