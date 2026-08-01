import { BlockPreviewChrome } from '@/features/entities/components/BlockPreviewChrome'
import { CodeBlockPreview } from '@/features/entities/components/blocks/CodeBlockPreview'
import { ImageBlockPreview } from '@/features/entities/components/blocks/ImageBlockPreview'
import { ListBlockPreview } from '@/features/entities/components/blocks/ListBlockPreview'
import { TextBlockPreview } from '@/features/entities/components/blocks/TextBlockPreview'
import type { EntityBlockForm } from '@/features/entities/types'

type BlockPreviewRouterProps = {
  block: EntityBlockForm
}

export function BlockPreviewRouter({ block }: BlockPreviewRouterProps) {
  return (
    <BlockPreviewChrome blockType={block.blockType}>
      {block.blockType === 'text' ? <TextBlockPreview contentJson={block.contentJson} /> : null}

      {block.blockType === 'code' ? <CodeBlockPreview contentJson={block.contentJson} /> : null}

      {block.blockType === 'image' ? <ImageBlockPreview previewUrl={block.previewUrl} /> : null}

      {block.blockType === 'list' ? <ListBlockPreview rows={block.rows} /> : null}
    </BlockPreviewChrome>
  )
}
