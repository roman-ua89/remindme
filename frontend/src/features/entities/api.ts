import type { ListSearchQuery } from '@remindme/contracts/common/pagination';
import type {
    Entity,
    EntityListItem,
    EntityListPage,
    EntityMarker,
    EntityVisibility,
    SaveEntityInput,
    SetEntityMarkerInput,
    SetEntityVisibilityInput,
    UpdateEntityInput,
} from '@remindme/contracts/entities';

import { apiClient } from '@/lib/api-client';

export async function getEntities(categoryId: string, topicId: string, query: ListSearchQuery): Promise<EntityListPage> {
    const { data } = await apiClient.get<EntityListPage>(`/categories/${categoryId}/topics/${topicId}/entities`, { params: query });
    return data;
}

export async function createEntity(categoryId: string, topicId: string, payload: SaveEntityInput): Promise<Entity> {
    const { data } = await apiClient.post<Entity>(`/categories/${categoryId}/topics/${topicId}/entities`, payload);
    return data;
}

export async function getEntity(categoryId: string, topicId: string, entityId: string): Promise<Entity> {
    const { data } = await apiClient.get<Entity>(`/categories/${categoryId}/topics/${topicId}/entities/${entityId}`);
    return data;
}

export async function getEntityById(entityId: string): Promise<Entity> {
    const { data } = await apiClient.get<Entity>(`/entities/${entityId}`);
    return data;
}

export async function updateEntity(categoryId: string, topicId: string, entityId: string, payload: UpdateEntityInput): Promise<Entity> {
    const { data } = await apiClient.patch<Entity>(`/categories/${categoryId}/topics/${topicId}/entities/${entityId}`, payload);
    return data;
}

export async function deleteEntity(categoryId: string, topicId: string, entityId: string): Promise<void> {
    await apiClient.delete(`/categories/${categoryId}/topics/${topicId}/entities/${entityId}`);
}

export async function setEntityMarker(categoryId: string, topicId: string, entityId: string, marker: EntityMarker | null): Promise<EntityListItem> {
    const payload: SetEntityMarkerInput = { marker };
    const { data } = await apiClient.patch<EntityListItem>(`/categories/${categoryId}/topics/${topicId}/entities/${entityId}/marker`, payload);
    return data;
}

export async function setEntityVisibility(
    categoryId: string,
    topicId: string,
    entityId: string,
    visibility: EntityVisibility,
): Promise<EntityListItem> {
    const payload: SetEntityVisibilityInput = { visibility };
    const { data } = await apiClient.patch<EntityListItem>(`/categories/${categoryId}/topics/${topicId}/entities/${entityId}/visibility`, payload);
    return data;
}
