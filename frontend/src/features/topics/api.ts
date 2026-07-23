import type { CreateTopicInput, Topic } from '@remindme/contracts/topics'

import { apiClient } from '@/lib/api-client'

export async function getTopics(categoryId: string): Promise<Topic[]> {
  const { data } = await apiClient.get<Topic[]>(`/categories/${categoryId}/topics`)
  return data
}

export async function createTopic(
  categoryId: string,
  payload: CreateTopicInput,
): Promise<Topic> {
  const { data } = await apiClient.post<Topic>(
    `/categories/${categoryId}/topics`,
    payload,
  )
  return data
}
