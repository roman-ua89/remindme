import { useState } from 'react'

import { Button } from '@/components/ui/button'
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
  const [currentRowIndex, setCurrentRowIndex] = useState(0)
  const { showOneLineAtATime, blurRightSideByDefault } = contentJson

  if (showOneLineAtATime) {
    const safeIndex = Math.min(currentRowIndex, Math.max(rows.length - 1, 0))
    const row = rows[safeIndex]

    return (
      <div className="flex flex-col gap-2">
        {row ? (
          <ListRowPreview
            key={safeIndex}
            row={row}
            blurRightSideByDefault={blurRightSideByDefault}
          />
        ) : null}

        {rows.length > 1 ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safeIndex === 0}
              onClick={() => setCurrentRowIndex((index) => Math.max(index - 1, 0))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {safeIndex + 1} / {rows.length}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safeIndex >= rows.length - 1}
              onClick={() =>
                setCurrentRowIndex((index) => Math.min(index + 1, rows.length - 1))
              }
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>
    )
  }

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
