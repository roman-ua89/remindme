import { BlockPreviewRouter } from '@/features/entities/components/BlockPreviewRouter'
import type { EntityBlockForm } from '@/features/entities/types'

type EntityReadOnlyContentProps = {
  title: string
  blocks: EntityBlockForm[]
}

export function EntityReadOnlyContent({ title, blocks }: EntityReadOnlyContentProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">{title}</h2>

      {blocks.length > 0 ? (
        <div className="flex flex-col gap-4">
          {blocks.map((block) => (
            <BlockPreviewRouter key={block.clientId} block={block} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
