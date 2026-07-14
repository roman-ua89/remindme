import { createFileRoute } from '@tanstack/react-router'

import { EntitiesPage } from '@/features/entities/components/EntitiesPage'

export const Route = createFileRoute(
  '/_app/categories/$categoryId/topics/$topicId/',
)({
  component: EntitiesPage,
})
