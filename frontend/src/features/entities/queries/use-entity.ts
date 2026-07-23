import { useQuery } from '@tanstack/react-query'

import { getEntity } from '@/features/entities/api'
import { queryKeys } from '@/lib/query-keys'

export function useEntity(
  categoryId: string,
  topicId: string,
  entityId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.entities.detail(categoryId, topicId, entityId!),
    queryFn: () => getEntity(categoryId, topicId, entityId!),
    enabled: Boolean(entityId),
  })
}
