import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import { EntityReadOnlyContent } from '@/features/entities/components/EntityReadOnlyContent'
import { useEntity } from '@/features/entities/queries/use-entity'
import { toEntityFormValues } from '@/features/entities/utils/to-form-values'

interface IProps {
  categoryId: string
  topicId: string
  entityId: string | undefined
  togglePreviewMode: () => void
}

export const EntityPreview = ({ categoryId, topicId, entityId, togglePreviewMode }: IProps) => {
  const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useEntity({
    categoryId,
    topicId,
    entityId,
  })

  if (isEntityLoading) {
    return (
      <PageContainer className="flex flex-col gap-4 py-8">
        <p className="text-muted-foreground">Loading entity preview…</p>
      </PageContainer>
    )
  }

  if (isEntityError || !entity) {
    return (
      <PageContainer className="flex flex-col gap-4 py-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Entity not found</h1>
          <Button type="button" variant="outline" onClick={togglePreviewMode}>
            Close Preview
          </Button>
        </div>
        <p className="text-muted-foreground">Unable to load entity preview.</p>
      </PageContainer>
    )
  }

  const { title, blocks } = toEntityFormValues(entity)

  return (
    <PageContainer className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Preview</h1>
        <Button type="button" variant="outline" onClick={togglePreviewMode}>
          Close Preview
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <EntityReadOnlyContent title={title} blocks={blocks} />
      </div>
    </PageContainer>
  )
}
