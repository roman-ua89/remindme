import { useQuery } from '@tanstack/react-query';

import { getTopicById } from '@/features/topics/api';
import { queryKeys } from '@/lib/query-keys';

export function useTopic(categoryId: string, topicId: string) {
    return useQuery({
        queryKey: queryKeys.topics.detail(categoryId, topicId),
        queryFn: () => getTopicById(categoryId, topicId),
    });
}
