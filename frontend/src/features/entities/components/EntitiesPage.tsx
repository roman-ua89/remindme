import { useNavigate, useParams } from '@tanstack/react-router'

import { AppHeader } from '@/components/layout/AppHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs'
import { AddEntityButton } from '@/features/entities/components/AddEntityButton'
import { EmptyEntityPrompt } from '@/features/entities/components/EmptyEntityPrompt'
import { EntityList } from '@/features/entities/components/EntityList'
import { useDeleteEntity } from '@/features/entities/queries/use-delete-entity'
import { useEntities } from '@/features/entities/queries/use-entities'
import { useCategory } from '@/features/categories/queries/use-category'
import { useTopic } from '@/features/topics/queries/use-topic'

export function EntitiesPage() {
  const navigate = useNavigate()
  const { categoryId, topicId } = useParams({
    from: '/_app/categories/$categoryId/topics/$topicId/',
  })

  const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } =
    useCategory(categoryId)
  const { data: topic, isLoading: isTopicLoading, isError: isTopicError } =
    useTopic(categoryId, topicId)
  const { data: entities = [], isLoading: isEntitiesLoading } = useEntities(
    categoryId,
    topicId,
  )
  const { mutate: deleteEntity } = useDeleteEntity(categoryId, topicId)

  const isLoading = isCategoryLoading || isTopicLoading || isEntitiesLoading

  function handleEditEntity(id: string) {
    navigate({
      to: '/categories/$categoryId/topics/$topicId/entities/$entityId',
      params: { categoryId, topicId, entityId: id },
    })
  }

  function handleRemoveEntity(id: string) {
    deleteEntity({ entityId: id })
  }

  const hasEntities = entities.length > 0

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <PageContainer className="py-8">
        {isLoading ? (
          <div className="flex flex-col items-center gap-1 py-12 text-muted-foreground">
            Loading entities…
          </div>
        ) : isCategoryError || isTopicError || !category || !topic ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Topic not found
              </h1>
              <AppBreadcrumbs
                category={
                  category ? { id: categoryId, name: category.name } : undefined
                }
              />
            </div>
            <p className="text-muted-foreground">Topic not found.</p>
          </div>
        ) : hasEntities ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  {topic.name}
                </h1>
                <AppBreadcrumbs
                  category={{ id: categoryId, name: category.name }}
                  topic={{ id: topicId, name: topic.name }}
                />
              </div>
              <AddEntityButton categoryId={categoryId} topicId={topicId} />
            </div>

            <EntityList
              entities={entities}
              onEdit={handleEditEntity}
              onRemove={handleRemoveEntity}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                {topic.name}
              </h1>
              <AppBreadcrumbs
                category={{ id: categoryId, name: category.name }}
                topic={{ id: topicId, name: topic.name }}
              />
            </div>
            <EmptyEntityPrompt categoryId={categoryId} topicId={topicId} />
          </div>
        )}
      </PageContainer>
    </div>
  )
}
