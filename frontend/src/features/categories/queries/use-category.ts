import { useQuery } from '@tanstack/react-query'

import { getCategoryById } from '@/features/categories/api'
import { queryKeys } from '@/lib/query-keys'

export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: () => getCategoryById(categoryId),
  })
}
