import { useQuery } from '@tanstack/react-query';

import { getEntity } from '@/features/entities/api';
import { queryKeys } from '@/lib/query-keys';

interface IProps {
    categoryId: string;
    topicId: string;
    entityId: string | undefined;
}

export function useEntity({ categoryId, topicId, entityId }: IProps) {
    return useQuery({
        queryKey: queryKeys.entities.detail(categoryId, topicId, entityId!),
        queryFn: () => getEntity(categoryId, topicId, entityId!),
        enabled: Boolean(entityId),

    });
}
