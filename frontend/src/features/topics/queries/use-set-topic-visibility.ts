import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { EntityVisibility } from '@remindme/contracts/entities';

import { setTopicVisibility } from '@/features/topics/api';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

type SetTopicVisibilityVariables = {
    categoryId: string;
    topicId: string;
    visibility: EntityVisibility;
};

export function useSetTopicVisibility() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, topicId, visibility }: SetTopicVisibilityVariables) => setTopicVisibility(categoryId, topicId, visibility),
        onSuccess: async (_updated, { categoryId, topicId }) => {
            // Awaited so an optimistic switch keeps its value until the refetched lists show the confirmed visibility.
            await Promise.all([
                // A topic-level change rewrites every entity in the topic, so all of its entity lists and details are stale.
                queryClient.invalidateQueries({ queryKey: queryKeys.entities.all(categoryId, topicId) }),
                queryClient.invalidateQueries({ queryKey: [...queryKeys.topics.all(categoryId), 'list'] }),
                queryClient.invalidateQueries({ queryKey: queryKeys.topics.detail(categoryId, topicId) }),
                queryClient.invalidateQueries({ queryKey: [...queryKeys.categories.all, 'list'] }),
            ]);
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
