import { Link } from '@tanstack/react-router'
import { PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayButton } from '@/features/player/components/PlayButton'
import type { Topic } from '@/features/topics/types'

type TopicCardProps = {
  topic: Topic
  onRename: (id: string) => void
  onDelete: (id: string) => void
}

export function TopicCard({ topic, onRename, onDelete }: TopicCardProps) {
  const canDelete = topic.entityCount === 0
  const canPlay = topic.entityCount > 0

  return (
    <Card size="sm" className="transition-colors hover:bg-muted/40">
      <CardHeader>
        <CardTitle>
          <Link
            to="/categories/$categoryId/topics/$topicId"
            params={{ categoryId: topic.categoryId, topicId: topic.id }}
            className="block w-full py-1 hover:text-primary"
          >
            {topic.name}
          </Link>
        </CardTitle>
        <CardAction>
          <div className="flex items-center gap-1">
            <PlayButton
              scope={{ type: 'topic', topicId: topic.id }}
              disabled={!canPlay}
              ariaLabel="Play topic"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Rename topic"
              onClick={() => onRename(topic.id)}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              aria-label="Delete topic"
              disabled={!canDelete}
              onClick={() => onDelete(topic.id)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
