import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { deleteTopic } from '@/features/topics/api'
import { getApiErrorMessage } from '@/lib/auth'
import { queryKeys } from '@/lib/query-keys'

type DeleteTopicVariables = {
  topicId: string
}

export function useDeleteTopic(categoryId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ topicId }: DeleteTopicVariables) =>
      deleteTopic(categoryId, topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.all(categoryId) })
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(categoryId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
