import type { ListSearchQuery, PaginationQuery } from '@remindme/contracts/common/pagination'

export const queryKeys = {
  auth: {
    currentUser: ['auth', 'current-user'] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (pagination: PaginationQuery) =>
      ['categories', 'list', pagination] as const,
    detail: (id: string) => ['categories', id] as const,
  },
  topics: {
    all: (categoryId: string) => ['categories', categoryId, 'topics'] as const,
    list: (categoryId: string, pagination: PaginationQuery) =>
      ['categories', categoryId, 'topics', 'list', pagination] as const,
    detail: (categoryId: string, topicId: string) =>
      ['categories', categoryId, 'topics', topicId] as const,
  },
  entities: {
    all: (categoryId: string, topicId: string) =>
      ['categories', categoryId, 'topics', topicId, 'entities'] as const,
    list: (categoryId: string, topicId: string, query: ListSearchQuery) =>
      [
        'categories',
        categoryId,
        'topics',
        topicId,
        'entities',
        'list',
        query,
      ] as const,
    detail: (categoryId: string, topicId: string, entityId: string) =>
      ['categories', categoryId, 'topics', topicId, 'entities', entityId] as const,
  },
  player: {
    all: ['player'] as const,
    batch: (scopeKey: string) => ['player', 'batch', scopeKey] as const,
  },
} as const
