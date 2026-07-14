import { PlusIcon, XIcon } from 'lucide-react'
import type { Control, FieldPath } from 'react-hook-form'
import { Controller, useFieldArray } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  EntityConstructorFormValues,
  ListBlockRow,
} from '@/features/entities/types'
import { createEmptyListRow } from '@/features/entities/utils/block-factory'

type ListBlockEditorProps = {
  control: Control<EntityConstructorFormValues>
  name: FieldPath<EntityConstructorFormValues>
}

export function ListBlockEditor({ control, name }: ListBlockEditorProps) {
  const rowsPath = `${name}.rows` as 'blocks.0.rows'

  const { fields, append, remove } = useFieldArray({
    control,
    name: rowsPath,
  })

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, rowIndex) => (
        <div key={field.id} className="flex items-center gap-2">
          <Controller
            control={control}
            name={`${rowsPath}.${rowIndex}.leftValue` as 'blocks.0.rows.0.leftValue'}
            render={({ field: leftField }) => (
              <Input
                {...leftField}
                placeholder="left"
                aria-label={`Row ${rowIndex + 1} left value`}
              />
            )}
          />
          <Controller
            control={control}
            name={`${rowsPath}.${rowIndex}.rightValue` as 'blocks.0.rows.0.rightValue'}
            render={({ field: rightField }) => (
              <Input
                {...rightField}
                placeholder="right"
                aria-label={`Row ${rowIndex + 1} right value`}
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove row"
            disabled={fields.length === 1}
            onClick={() => remove(rowIndex)}
          >
            <XIcon />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => append(createEmptyListRow() as ListBlockRow)}
      >
        <PlusIcon />
        Add row
      </Button>
    </div>
  )
}
