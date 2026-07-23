export const queryKeys = {
  auth: {
    currentUser: ['auth', 'current-user'] as const,
  },
  categories: {
    all: ['categories'] as const,
    detail: (id: string) => ['categories', id] as const,
  },
  topics: {
    all: (categoryId: string) => ['categories', categoryId, 'topics'] as const,
    detail: (categoryId: string, topicId: string) =>
      ['categories', categoryId, 'topics', topicId] as const,
  },
  entities: {
    all: (categoryId: string, topicId: string) =>
      ['categories', categoryId, 'topics', topicId, 'entities'] as const,
    detail: (categoryId: string, topicId: string, entityId: string) =>
      ['categories', categoryId, 'topics', topicId, 'entities', entityId] as const,
  },
} as const
