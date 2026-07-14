import { FileTextIcon } from 'lucide-react'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AddEntityButton } from '@/features/entities/components/AddEntityButton'

type EmptyEntityPromptProps = {
  categoryId: string
  topicId: string
}

export function EmptyEntityPrompt({ categoryId, topicId }: EmptyEntityPromptProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon />
        </EmptyMedia>
        <EmptyTitle>No entities yet</EmptyTitle>
        <EmptyDescription>
          Add your first entity to start building revisable content.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <AddEntityButton categoryId={categoryId} topicId={topicId} />
      </EmptyContent>
    </Empty>
  )
}
