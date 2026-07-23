import { useParams } from '@tanstack/react-router'

import { AppHeader } from '@/components/layout/AppHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs'
import { useCategory } from '@/features/categories/queries/use-category'
import { AddTopicPopover } from '@/features/topics/components/AddTopicPopover'
import { EmptyTopicPrompt } from '@/features/topics/components/EmptyTopicPrompt'
import { TopicList } from '@/features/topics/components/TopicList'
import { useDeleteTopic } from '@/features/topics/queries/use-delete-topic'
import { useTopics } from '@/features/topics/queries/use-topics'

export function TopicsPage() {
  const { categoryId } = useParams({ from: '/_app/categories/$categoryId/' })
  const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } = useCategory(categoryId)
  const { data: topics = [], isLoading: isTopicsLoading } = useTopics(categoryId)
  const { mutate: deleteTopic } = useDeleteTopic(categoryId)

  const isLoading = isCategoryLoading || isTopicsLoading

  function handleDeleteTopic(id: string) {
    deleteTopic({ topicId: id })
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <AppHeader />
        <PageContainer className='flex flex-col gap-4 py-8'>
          <p className='text-muted-foreground'>Loading topics…</p>
        </PageContainer>
      </div>
    )
  }

  if (isCategoryError || !category) {
    return (
      <div className='min-h-screen bg-background'>
        <AppHeader />
        <PageContainer className='flex flex-col gap-4 py-8'>
          <div className='flex flex-col gap-1'>
            <h1 className='font-heading text-2xl font-semibold tracking-tight'>Category not found</h1>
            <AppBreadcrumbs />
          </div>
          <p className='text-muted-foreground'>Category not found.</p>
        </PageContainer>
      </div>
    )
  }

  const hasTopics = topics.length > 0

  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />

      <PageContainer className='py-8'>
        <div className='flex flex-col gap-6'>
          {hasTopics ? (
            <>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <h1 className='font-heading text-2xl font-semibold tracking-tight'>Topics</h1>
                  </div>
                  <AppBreadcrumbs category={{ id: categoryId, name: category.name }} />
                </div>
                <AddTopicPopover categoryId={categoryId} />
              </div>

              <TopicList topics={topics} onDelete={handleDeleteTopic} />
            </>
          ) : (
            <>
              <div className='flex flex-col justify-between gap-1'>
                <h1 className='font-heading text-2xl font-semibold tracking-tight'>{category.name}</h1>
                <AppBreadcrumbs category={{ id: categoryId, name: category.name }} />
              </div>
              <EmptyTopicPrompt categoryId={categoryId} />
            </>
          )}
        </div>
      </PageContainer>
    </div>
  )
}
