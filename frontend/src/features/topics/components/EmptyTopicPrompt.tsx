import { BookOpenIcon } from 'lucide-react'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { AddTopicPopover } from '@/features/topics/components/AddTopicPopover'

type EmptyTopicPromptProps = {
  onAddTopic: (name: string) => void
}

export function EmptyTopicPrompt({ onAddTopic }: EmptyTopicPromptProps) {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookOpenIcon />
        </EmptyMedia>
        <EmptyTitle>No topics yet</EmptyTitle>
        <EmptyDescription>
          Create your first topic to start adding reminders and entities.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <AddTopicPopover onSave={onAddTopic} />
      </EmptyContent>
    </Empty>
  )
}
