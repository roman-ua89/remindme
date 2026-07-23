import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createTopic } from '@/features/topics/api'
import type { CreateTopicFormValues } from '@/features/topics/schemas'
import { getApiErrorMessage } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'

export function useCreateTopic(categoryId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name }: CreateTopicFormValues) =>
      createTopic(categoryId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all(categoryId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(categoryId) })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
