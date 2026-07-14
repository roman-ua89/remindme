import { FolderOpenIcon } from 'lucide-react'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AddCategoryPopover } from '@/features/categories/components/AddCategoryPopover'

type EmptyCategoryPromptProps = {
  onAddCategory: (name: string) => void
}

export function EmptyCategoryPrompt({ onAddCategory }: EmptyCategoryPromptProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle>No categories yet</EmptyTitle>
        <EmptyDescription>
          Create your first category to start organizing topics and reminders.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <AddCategoryPopover onSave={onAddCategory} />
      </EmptyContent>
    </Empty>
  )
}
