import { useState } from 'react'

import type { ListBlockContentJson, ListBlockRow } from '@/features/entities/types'

type ListBlockPreviewProps = {
  rows: ListBlockRow[]
  contentJson: ListBlockContentJson
}

type ListRowPreviewProps = {
  row: ListBlockRow
  blurRightSideByDefault: boolean
}

function ListRowPreview({ row, blurRightSideByDefault }: ListRowPreviewProps) {
  const [revealed, setRevealed] = useState(false)
  const isBlurred = blurRightSideByDefault && !revealed

  return (
    <div className="grid grid-cols-2 gap-4 border-b border-border pb-2 last:border-b-0 last:pb-0">
      <span>{row.leftValue || '\u00A0'}</span>
      <span
        className={isBlurred ? 'cursor-pointer select-none blur-sm' : undefined}
        onClick={() => {
          if (blurRightSideByDefault) {
            setRevealed((current) => !current)
          }
        }}
        onKeyDown={(event) => {
          if (!blurRightSideByDefault) {
            return
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setRevealed((current) => !current)
          }
        }}
        role={blurRightSideByDefault ? 'button' : undefined}
        tabIndex={blurRightSideByDefault ? 0 : undefined}
      >
        {row.rightValue || '\u00A0'}
      </span>
    </div>
  )
}

export function ListBlockPreview({ rows, contentJson }: ListBlockPreviewProps) {
  const { blurRightSideByDefault } = contentJson

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, index) => (
        <ListRowPreview
          key={index}
          row={row}
          blurRightSideByDefault={blurRightSideByDefault}
        />
      ))}
    </div>
  )
}
