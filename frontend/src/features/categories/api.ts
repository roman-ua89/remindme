import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@remindme/contracts/categories';

import { apiClient } from '@/lib/api-client';

export async function getCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
}

export async function getCategoryById(categoryId: string): Promise<Category> {
    const { data } = await apiClient.get<Category>(`/categories/${categoryId}`);
    return data;
}

export async function createCategory(payload: CreateCategoryInput): Promise<Category> {
    const { data } = await apiClient.post<Category>('/categories', payload);
    return data;
}

export async function updateCategory(categoryId: string, payload: UpdateCategoryInput): Promise<Category> {
    const { data } = await apiClient.patch<Category>(`/categories/${categoryId}`, payload);
    return data;
}
