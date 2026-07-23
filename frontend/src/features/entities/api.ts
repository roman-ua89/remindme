import type {
  Entity,
  EntityListItem,
  SaveEntityInput,
} from '@remindme/contracts/entities'

import { apiClient } from '@/lib/api-client'

export async function getEntities(
  categoryId: string,
  topicId: string,
): Promise<EntityListItem[]> {
  const { data } = await apiClient.get<EntityListItem[]>(
    `/categories/${categoryId}/topics/${topicId}/entities`,
  )
  return data
}

export async function createEntity(
  categoryId: string,
  topicId: string,
  payload: SaveEntityInput,
): Promise<Entity> {
  const { data } = await apiClient.post<Entity>(
    `/categories/${categoryId}/topics/${topicId}/entities`,
    payload,
  )
  return data
}

export async function deleteEntity(
  categoryId: string,
  topicId: string,
  entityId: string,
): Promise<void> {
  await apiClient.delete(
    `/categories/${categoryId}/topics/${topicId}/entities/${entityId}`,
  )
}
