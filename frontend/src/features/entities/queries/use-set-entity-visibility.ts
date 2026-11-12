import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { setEntityVisibility } from '@/features/entities/api';
import type { EntityVisibility } from '@/features/entities/types';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

type SetEntityVisibilityVariables = {
    categoryId: string;
    topicId: string;
    entityId: string;
    visibility: EntityVisibility;
};

export function useSetEntityVisibility() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, topicId, entityId, visibility }: SetEntityVisibilityVariables) =>
            setEntityVisibility(categoryId, topicId, entityId, visibility),
        onSuccess: async (_updated, { categoryId, topicId, entityId }) => {
            // Awaited so an optimistic switch keeps its value until the refetched lists and detail show the confirmed visibility.
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: [...queryKeys.entities.all(categoryId, topicId), 'list'] }),
                queryClient.invalidateQueries({ queryKey: queryKeys.entities.detail(categoryId, topicId, entityId) }),
                queryClient.invalidateQueries({ queryKey: [...queryKeys.topics.all(categoryId), 'list'] }),
                queryClient.invalidateQueries({ queryKey: [...queryKeys.categories.all, 'list'] }),
            ]);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
