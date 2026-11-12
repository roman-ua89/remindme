import type { Category } from '@/features/categories/types';

export const DEMO_CATEGORIES: Category[] = [
    { id: '1', name: 'English', topicCount: 3, entityCount: 10, completion: 40, markers: [], hasExcludedEntities: false },
    { id: '2', name: 'TypeScript', topicCount: 2, entityCount: 6, completion: 0, markers: [], hasExcludedEntities: false },
    { id: '3', name: 'React', topicCount: 1, entityCount: 6, completion: 0, markers: [], hasExcludedEntities: false },
    { id: '4', name: 'NodeJS', topicCount: 0, entityCount: 0, completion: 0, markers: [], hasExcludedEntities: false },
];
