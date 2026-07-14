import type { Control } from 'react-hook-form'

import { BlockChrome } from '@/features/entities/components/BlockChrome'
import { CodeBlockEditor } from '@/features/entities/components/blocks/CodeBlockEditor'
import { ImageBlockEditor } from '@/features/entities/components/blocks/ImageBlockEditor'
import { ListBlockEditor } from '@/features/entities/components/blocks/ListBlockEditor'
import { TextBlockEditor } from '@/features/entities/components/blocks/TextBlockEditor'
import type {
  EntityBlockForm,
  EntityConstructorFormValues,
} from '@/features/entities/types'

type BlockEditorRouterProps = {
  control: Control<EntityConstructorFormValues>
  index: number
  block: EntityBlockForm
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  onRemove: () => void
}

export function BlockEditorRouter({
  control,
  index,
  block,
  dragHandleProps,
  onRemove,
}: BlockEditorRouterProps) {
  const baseName = `blocks.${index}` as const

  return (
    <BlockChrome
      blockType={block.blockType}
      dragHandleProps={dragHandleProps}
      onRemove={onRemove}
    >
      {block.blockType === 'text' ? (
        <TextBlockEditor
          control={control}
          name={`${baseName}.contentJson`}
        />
      ) : null}

      {block.blockType === 'code' ? (
        <CodeBlockEditor
          control={control}
          name={`${baseName}.contentJson`}
        />
      ) : null}

      {block.blockType === 'image' ? (
        <ImageBlockEditor control={control} name={baseName} />
      ) : null}

      {block.blockType === 'list' ? (
        <ListBlockEditor control={control} name={baseName} />
      ) : null}
    </BlockChrome>
  )
}
