import { EntityReadOnlyContent } from '@/features/entities/components/EntityReadOnlyContent'
import { toEntityFormValues } from '@/features/entities/utils/to-form-values'
import type { PlayerBatchItem } from '@/features/player/types'

type PlayerPreviewProps = {
    entity: PlayerBatchItem
}

export function PlayerPreview({ entity }: PlayerPreviewProps) {
    const { title, blocks } = toEntityFormValues(entity)

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <EntityReadOnlyContent title={title} blocks={blocks} />
        </div>
    )
}
