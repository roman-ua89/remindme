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
  },
} as const
