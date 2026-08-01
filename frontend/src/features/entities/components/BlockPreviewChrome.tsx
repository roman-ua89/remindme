import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import type { BlockType } from '@/features/entities/types'

const blockTypeLabels: Record<BlockType, string> = {
  text: 'Text',
  code: 'Code',
  image: 'Image',
  list: 'List',
}

type BlockPreviewChromeProps = {
  blockType: BlockType
  children: ReactNode
  className?: string
}

export function BlockPreviewChrome({ blockType, children, className }: BlockPreviewChromeProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      <div className="border-b border-border px-3 py-2">
        <span className="text-sm font-medium">{blockTypeLabels[blockType]}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
