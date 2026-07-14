import { Link } from '@tanstack/react-router'
import { PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayButton } from '@/features/player/components/PlayButton'
import { getEntityCountByCategoryId } from '@/features/topics/demo-data'
import type { Category } from '@/features/categories/types'

type CategoryCardProps = {
  category: Category
  onRename: (id: string) => void
  onDelete: (id: string) => void
}

export function CategoryCard({
  category,
  onRename,
  onDelete,
}: CategoryCardProps) {
  const canDelete = category.topicCount === 0
  const canPlay = getEntityCountByCategoryId(category.id) > 0

  return (
    <Card size="sm" className="transition-colors hover:bg-muted/40">
      <CardHeader>
        <CardTitle>
          <Link
            to="/categories/$categoryId"
            params={{ categoryId: category.id }}
            className="block w-full py-1 hover:text-primary"
          >
            {category.name}
          </Link>
        </CardTitle>
        <CardAction>
          <div className="flex items-center gap-1">
            <PlayButton
              scope={{ type: 'category', categoryId: category.id }}
              disabled={!canPlay}
              ariaLabel="Play category"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Rename category"
              onClick={() => onRename(category.id)}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              aria-label="Delete category"
              disabled={!canDelete}
              onClick={() => onDelete(category.id)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
