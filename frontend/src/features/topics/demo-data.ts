import { DEMO_CATEGORIES } from '@/features/categories/demo-data';
import type { Category } from '@/features/categories/types';
import type { Topic } from '@/features/topics/types';

export const DEMO_TOPICS: Topic[] = [
    { id: 't1', name: 'Verbs', categoryId: '1', entityCount: 5, markers: [] },
    { id: 't2', name: 'Idioms', categoryId: '1', entityCount: 3, markers: [] },
    { id: 't3', name: 'Grammar', categoryId: '1', entityCount: 2, markers: [] },
    { id: 't4', name: 'Generics', categoryId: '2', entityCount: 4, markers: [] },
    { id: 't5', name: 'Utility Types', categoryId: '2', entityCount: 2, markers: [] },
    { id: 't6', name: 'Hooks', categoryId: '3', entityCount: 6, markers: [] },
];

export function getCategoryById(categoryId: string): Category | undefined {
    return DEMO_CATEGORIES.find((category) => category.id === categoryId);
}

export function getTopicsByCategoryId(categoryId: string): Topic[] {
    return DEMO_TOPICS.filter((topic) => topic.categoryId === categoryId);
}
