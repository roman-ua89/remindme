import type { Entity, EntityBlockResponse } from '@remindme/contracts/entities'

import type {
  EntityBlockForm,
  EntityConstructorFormValues,
} from '@/features/entities/types'
import { resolveMediaUrl } from '@/features/media/utils'

function toFormBlock(block: EntityBlockResponse): EntityBlockForm {
  const clientId = crypto.randomUUID()

  switch (block.blockType) {
    case 'text':
      return {
        clientId,
        blockType: 'text',
        contentJson: block.contentJson,
      }
    case 'code':
      return {
        clientId,
        blockType: 'code',
        contentJson: block.contentJson,
      }
    case 'image':
      return {
        clientId,
        blockType: 'image',
        mediaAssetId: block.mediaAssetId,
        previewUrl: block.mediaUrl ? resolveMediaUrl(block.mediaUrl) : undefined,
      }
    case 'list':
      return {
        clientId,
        blockType: 'list',
        rows: block.rows.map(({ leftValue, rightValue }) => ({
          leftValue,
          rightValue,
        })),
      }
  }
}

export function toEntityFormValues(entity: Entity): EntityConstructorFormValues {
  const sortedBlocks = [...entity.blocks].sort((a, b) => a.position - b.position)

  return {
    title: entity.title,
    blocks: sortedBlocks.map(toFormBlock),
  }
}
