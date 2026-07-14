export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'RemindMe API',
    version: '1.0.0',
    description: 'REST API for the RemindMe spaced-revision application',
  },
  servers: [{ url: '/api/v1' }],
  tags: [
    { name: 'auth' },
    { name: 'categories' },
    { name: 'topics' },
    { name: 'entities' },
    { name: 'media' },
    { name: 'users' },
  ],
  paths: {
    '/auth/register': {
      post: { tags: ['auth'], summary: 'Register a new user' },
    },
    '/auth/login': {
      post: { tags: ['auth'], summary: 'Login and set auth cookie' },
    },
    '/auth/logout': {
      post: { tags: ['auth'], summary: 'Logout and clear auth cookie' },
    },
    '/auth/me': {
      get: { tags: ['auth'], summary: 'Get current user profile' },
    },
    '/auth/forgot-password': {
      post: { tags: ['auth'], summary: 'Request password reset token' },
    },
    '/auth/reset-password': {
      post: { tags: ['auth'], summary: 'Reset password with token' },
    },
    '/categories': {
      get: { tags: ['categories'], summary: 'List categories' },
      post: { tags: ['categories'], summary: 'Create category' },
    },
    '/categories/{categoryId}': {
      patch: { tags: ['categories'], summary: 'Update category' },
      delete: { tags: ['categories'], summary: 'Delete empty category' },
    },
    '/categories/{categoryId}/topics': {
      get: { tags: ['topics'], summary: 'List topics in category' },
      post: { tags: ['topics'], summary: 'Create topic' },
    },
    '/categories/{categoryId}/topics/{topicId}': {
      get: { tags: ['topics'], summary: 'Get topic' },
      patch: { tags: ['topics'], summary: 'Update topic' },
      delete: { tags: ['topics'], summary: 'Delete topic' },
    },
    '/categories/{categoryId}/topics/{topicId}/entities': {
      get: { tags: ['entities'], summary: 'List entities in topic' },
      post: { tags: ['entities'], summary: 'Create entity with blocks' },
    },
    '/categories/{categoryId}/topics/{topicId}/entities/{entityId}': {
      get: { tags: ['entities'], summary: 'Get entity with blocks' },
      patch: { tags: ['entities'], summary: 'Update entity with blocks' },
      delete: { tags: ['entities'], summary: 'Delete entity' },
    },
    '/categories/{categoryId}/topics/{topicId}/entities/{entityId}/revise': {
      patch: { tags: ['entities'], summary: 'Mark entity as revised (Player Done)' },
    },
    '/categories/{categoryId}/topics/{topicId}/entities/{entityId}/skip': {
      patch: { tags: ['entities'], summary: 'Mark entity as skipped (Player Skip)' },
    },
    '/media/upload': {
      post: { tags: ['media'], summary: 'Upload image file' },
    },
    '/users': {
      get: { tags: ['users'], summary: 'List users (admin)' },
    },
    '/users/{id}': {
      get: { tags: ['users'], summary: 'Get user (admin)' },
      patch: { tags: ['users'], summary: 'Update user (admin)' },
    },
  },
}
