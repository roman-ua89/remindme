import { createFileRoute } from '@tanstack/react-router'

import { EntityConstructorPage } from '@/features/entities/components/EntityConstructorPage'

export const Route = createFileRoute(
  '/_app/categories/$categoryId/topics/$topicId/entities/$entityId',
)({
  component: EditEntityRoute,
})

function EditEntityRoute() {
  const { categoryId, topicId, entityId } = Route.useParams()

  return (
    <EntityConstructorPage
      categoryId={categoryId}
      topicId={topicId}
      entityId={entityId}
    />
  )
}
