import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { createCategory } from '@/features/categories/api'
import { getApiErrorMessage } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      navigate({
        to: '/categories/$categoryId',
        params: { categoryId: category.id },
      })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
