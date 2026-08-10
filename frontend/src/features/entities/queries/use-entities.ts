import { useQuery } from '@tanstack/react-query'

import { getEntities } from '@/features/entities/api'
import { queryKeys } from '@/lib/query-keys'

const DEFAULT_PAGE_SIZE = 10

export function useEntities(
  categoryId: string,
  topicId: string,
  page: number,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const pagination = { page, pageSize }

  return useQuery({
    queryKey: queryKeys.entities.list(categoryId, topicId, pagination),
    queryFn: () => getEntities(categoryId, topicId, pagination),
  })
}
