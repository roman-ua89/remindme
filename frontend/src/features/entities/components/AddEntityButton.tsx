import { Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AddEntityButtonProps = {
  categoryId: string
  topicId: string
}

export function AddEntityButton({ categoryId, topicId }: AddEntityButtonProps) {
  return (
    <Button
      render={
        <Link
          to="/categories/$categoryId/topics/$topicId/entities/new"
          params={{ categoryId, topicId }}
        />
      }
    >
      <PlusIcon />
      Add entity
    </Button>
  )
}
