import type { PaginationQuery } from '@remindme/contracts/common/pagination';
import type { EntityVisibility } from '@remindme/contracts/entities';
import type { CreateTopicInput, SetTopicVisibilityInput, Topic, TopicListPage, UpdateTopicInput } from '@remindme/contracts/topics';

import { apiClient } from '@/lib/api-client';

export async function getTopics(categoryId: string, pagination: PaginationQuery): Promise<TopicListPage> {
    const { data } = await apiClient.get<TopicListPage>(`/categories/${categoryId}/topics`, { params: pagination });
    return data;
}

export async function getTopicById(categoryId: string, topicId: string): Promise<Topic> {
    const { data } = await apiClient.get<Topic>(`/categories/${categoryId}/topics/${topicId}`);
    return data;
}

export async function createTopic(categoryId: string, payload: CreateTopicInput): Promise<Topic> {
    const { data } = await apiClient.post<Topic>(`/categories/${categoryId}/topics`, payload);
    return data;
}

export async function updateTopic(categoryId: string, topicId: string, payload: UpdateTopicInput): Promise<Topic> {
    const { data } = await apiClient.patch<Topic>(`/categories/${categoryId}/topics/${topicId}`, payload);
    return data;
}

export async function deleteTopic(categoryId: string, topicId: string): Promise<void> {
    await apiClient.delete(`/categories/${categoryId}/topics/${topicId}`);
}

export async function setTopicVisibility(categoryId: string, topicId: string, visibility: EntityVisibility): Promise<Topic> {
    const payload: SetTopicVisibilityInput = { visibility };
    const { data } = await apiClient.patch<Topic>(`/categories/${categoryId}/topics/${topicId}/visibility`, payload);
    return data;
}
