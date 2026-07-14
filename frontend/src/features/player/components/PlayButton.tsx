import { Link } from '@tanstack/react-router'
import { PlayIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { PlayerScope } from '@/features/player/types'

type PlayButtonProps = {
  scope: PlayerScope
  disabled?: boolean
  ariaLabel: string
}

function toPlayerSearch(scope: PlayerScope) {
  switch (scope.type) {
    case 'category':
      return { categoryId: scope.categoryId }
    case 'topic':
      return { topicId: scope.topicId }
    case 'entity':
      return { entityId: scope.entityId }
  }
}

export function PlayButton({ scope, disabled = false, ariaLabel }: PlayButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={ariaLabel}
      disabled={disabled}
      render={
        disabled ? undefined : (
          <Link to="/player" search={toPlayerSearch(scope)} />
        )
      }
    >
      <PlayIcon />
    </Button>
  )
}
