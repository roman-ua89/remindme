import type { ReactNode } from 'react'
import { GripVerticalIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BlockType } from '@/features/entities/types'

const blockTypeLabels: Record<BlockType, string> = {
  text: 'Text',
  code: 'Code',
  image: 'Image',
  list: 'List',
}

type BlockChromeProps = {
  blockType: BlockType
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  onRemove: () => void
  children: ReactNode
  className?: string
}

export function BlockChrome({
  blockType,
  dragHandleProps,
  onRemove,
  children,
  className,
}: BlockChromeProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="text-sm font-medium">{blockTypeLabels[blockType]}</span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Reorder block"
            className="cursor-grab active:cursor-grabbing"
            {...dragHandleProps}
          >
            <GripVerticalIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove block"
            onClick={onRemove}
          >
            <XIcon />
          </Button>
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
