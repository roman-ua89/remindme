import type {
  Entity,
  EntityListItem,
  SaveEntityInput,
  UpdateEntityInput,
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

export async function getEntity(
  categoryId: string,
  topicId: string,
  entityId: string,
): Promise<Entity> {
  const { data } = await apiClient.get<Entity>(
    `/categories/${categoryId}/topics/${topicId}/entities/${entityId}`,
  )
  return data
}

export async function updateEntity(
  categoryId: string,
  topicId: string,
  entityId: string,
  payload: UpdateEntityInput,
): Promise<Entity> {
  const { data } = await apiClient.patch<Entity>(
    `/categories/${categoryId}/topics/${topicId}/entities/${entityId}`,
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
