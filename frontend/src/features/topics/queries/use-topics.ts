import { useQuery } from '@tanstack/react-query'

import { getTopics } from '@/features/topics/api'
import { queryKeys } from '@/lib/query-keys'

export function useTopics(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.topics.all(categoryId),
    queryFn: () => getTopics(categoryId),
  })
}
