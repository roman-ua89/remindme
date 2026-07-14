import { PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayButton } from '@/features/player/components/PlayButton'
import type { Entity } from '@/features/entities/types'

type EntityCardProps = {
  entity: Entity
  onEdit: (id: string) => void
  onRemove: (id: string) => void
}

export function EntityCard({ entity, onEdit, onRemove }: EntityCardProps) {
  return (
    <Card size="sm" className="transition-colors hover:bg-muted/40">
      <CardHeader>
        <CardTitle>{entity.title}</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground tabular-nums">
              {entity.revisedCount} revised
            </span>
            <PlayButton
              scope={{ type: 'entity', entityId: entity.id }}
              ariaLabel="Play entity"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Edit entity"
              onClick={() => onEdit(entity.id)}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              aria-label="Remove entity"
              onClick={() => onRemove(entity.id)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
