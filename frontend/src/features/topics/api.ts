import type { CreateTopicInput, Topic, UpdateTopicInput } from '@remindme/contracts/topics'

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

export async function updateTopic(
  categoryId: string,
  topicId: string,
  payload: UpdateTopicInput,
): Promise<Topic> {
  const { data } = await apiClient.patch<Topic>(
    `/categories/${categoryId}/topics/${topicId}`,
    payload,
  )
  return data
}

export async function deleteTopic(
  categoryId: string,
  topicId: string,
): Promise<void> {
  await apiClient.delete(`/categories/${categoryId}/topics/${topicId}`)
}
