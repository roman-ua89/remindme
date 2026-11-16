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
        { name: 'player' },
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
            get: { tags: ['categories'], summary: 'Get category' },
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
        '/categories/{categoryId}/topics/{topicId}/visibility': {
            patch: {
                tags: ['topics'],
                summary:
                    'Set visibility of all entities in topic (body: { visibility: "included" | "excluded" }); returns topic',
            },
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
        '/entities/{entityId}': {
            get: { tags: ['entities'], summary: 'Get entity with blocks by entity ID only' },
        },
        '/categories/{categoryId}/topics/{topicId}/entities/{entityId}/revise': {
            patch: {
                tags: ['entities'],
                summary:
                    'Mark entity as revised (Player Done); also increments user_daily_activity for the X-Timezone local day',
            },
        },
        '/categories/{categoryId}/topics/{topicId}/entities/{entityId}/skip': {
            patch: {
                tags: ['entities'],
                summary:
                    'Mark entity as skipped (Player Skip); also increments user_daily_activity for the X-Timezone local day',
            },
        },
        '/activity/daily': {
            get: {
                tags: ['activity'],
                summary:
                    'Daily revised/skipped counters and playerSeconds for the current user (query: month=YYYY-MM; sparse days) + firstActivityDate',
            },
        },
        '/activity/today': {
            get: {
                tags: ['activity'],
                summary:
                    "Today's counters (revisedCount, skippedCount, playerSeconds) for the X-Timezone local day; zeros if none",
            },
        },
        '/activity/player-time': {
            post: {
                tags: ['activity'],
                summary:
                    "Add Player time (body: { seconds: 1..300 }) to the X-Timezone local day; returns today's counters",
            },
        },
        '/stats/library': {
            get: {
                tags: ['stats'],
                summary: 'Library totals for the current user: categoriesCount, topicsCount, entitiesCount',
            },
        },
        '/categories/{categoryId}/topics/{topicId}/entities/{entityId}/marker': {
            patch: { tags: ['entities'], summary: 'Set entity marker (body: { marker: 1 | 2 | null })' },
        },
        '/categories/{categoryId}/topics/{topicId}/entities/{entityId}/visibility': {
            patch: {
                tags: ['entities'],
                summary:
                    'Set entity visibility (body: { visibility: "included" | "excluded" }); does not change editedAt',
            },
        },
        '/player/batch': {
            post: {
                tags: ['player'],
                summary: 'Return a shuffled batch of eligible entities at the minimum revised_count',
            },
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
};
