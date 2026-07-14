import { Link } from '@tanstack/react-router'

import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/button'
import type { PlayerScope } from '@/features/player/types'

type PlayerPageProps = {
  scope: PlayerScope
}

function scopeLabel(scope: PlayerScope): string {
  switch (scope.type) {
    case 'category':
      return `category ${scope.categoryId}`
    case 'topic':
      return `topic ${scope.topicId}`
    case 'entity':
      return `entity ${scope.entityId}`
  }
}

export function PlayerPage({ scope }: PlayerPageProps) {
  return (
    <PageContainer className="py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Player</h1>
        <Button variant="outline" render={<Link to="/" />}>
          Stop
        </Button>
      </div>

      <p className="text-muted-foreground">
        Revision session for {scopeLabel(scope)}. Full Player UI is not implemented yet.
      </p>
    </PageContainer>
  )
}
