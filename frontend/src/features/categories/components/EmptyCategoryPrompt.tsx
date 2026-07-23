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

export function EmptyCategoryPrompt() {
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
        <AddCategoryPopover />
      </EmptyContent>
    </Empty>
  )
}
