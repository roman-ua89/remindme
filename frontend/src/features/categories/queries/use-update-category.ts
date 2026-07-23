import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateCategory } from '@/features/categories/api'
import type { UpdateCategoryFormValues } from '@/features/categories/schemas'
import { getApiErrorMessage } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'

type UpdateCategoryVariables = {
  categoryId: string
  payload: UpdateCategoryFormValues
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, payload }: UpdateCategoryVariables) =>
      updateCategory(categoryId, payload),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(category.id),
      })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
