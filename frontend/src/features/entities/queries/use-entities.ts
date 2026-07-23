import { useQuery } from '@tanstack/react-query'

import { getEntities } from '@/features/entities/api'
import { queryKeys } from '@/lib/query-keys'

export function useEntities(categoryId: string, topicId: string) {
  return useQuery({
    queryKey: queryKeys.entities.all(categoryId, topicId),
    queryFn: () => getEntities(categoryId, topicId),
  })
}
