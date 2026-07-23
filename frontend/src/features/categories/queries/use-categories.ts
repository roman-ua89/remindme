import { useQuery } from '@tanstack/react-query'

import { getCategories } from '@/features/categories/api'
import { queryKeys } from '@/lib/query-keys'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
  })
}
