import type { ListBlockRow } from '@/features/entities/types'

type ListBlockPreviewProps = {
  rows: ListBlockRow[]
}

export function ListBlockPreview({ rows }: ListBlockPreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-2 gap-4 border-b border-border pb-2 last:border-b-0 last:pb-0">
          <span>{row.leftValue || '\u00A0'}</span>
          <span>{row.rightValue || '\u00A0'}</span>
        </div>
      ))}
    </div>
  )
}
