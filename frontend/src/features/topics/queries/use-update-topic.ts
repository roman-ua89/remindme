import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updateTopic } from '@/features/topics/api'
import type { UpdateTopicFormValues } from '@/features/topics/schemas'
import { getApiErrorMessage } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'

type UpdateTopicVariables = {
  topicId: string
  payload: UpdateTopicFormValues
}

export function useUpdateTopic(categoryId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId, payload }: UpdateTopicVariables) =>
      updateTopic(categoryId, topicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all(categoryId) })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
