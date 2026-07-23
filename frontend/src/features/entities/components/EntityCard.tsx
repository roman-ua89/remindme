import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayButton } from '@/features/player/components/PlayButton'
import type { EntityListItem } from '@/features/entities/types'

type EntityCardProps = {
  entity: EntityListItem
  onEdit: (id: string) => void
  onRemove: (id: string) => void
}

export function EntityCard({ entity, onEdit, onRemove }: EntityCardProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)

  function handleRemove() {
    onRemove(entity.id)
    setRemoveDialogOpen(false)
  }

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
            <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" size="icon-sm" aria-label="Remove entity">
                    <Trash2Icon />
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove entity?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove &ldquo;{entity.title}&rdquo;. This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="default">Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleRemove}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
