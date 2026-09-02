import CodeMirror from '@uiw/react-codemirror'
import type { Control, FieldPath } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  CodeContentJson,
  EntityConstructorFormValues,
} from '@/features/entities/types'
import { getLanguageExtension } from '@/lib/codemirror/languages'

type CodeBlockEditorProps = {
  control: Control<EntityConstructorFormValues>
  name: FieldPath<EntityConstructorFormValues>
}

function toCodeContentJson(value: unknown): CodeContentJson {
  const json = value as Partial<CodeContentJson> | null | undefined

  return {
    language: json?.language === 'typescript' ? 'typescript' : 'javascript',
    value: json?.value ?? '',
    blurredByDefault: json?.blurredByDefault ?? false,
  }
}

export function CodeBlockEditor({ control, name }: CodeBlockEditorProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <CodeBlockEditorInner
          idPrefix={name}
          value={toCodeContentJson(field.value)}
          onChange={field.onChange}
        />
      )}
    />
  )
}

type CodeBlockEditorInnerProps = {
  idPrefix: string
  value: CodeContentJson
  onChange: (value: CodeContentJson) => void
}

function CodeBlockEditorInner({ idPrefix, value, onChange }: CodeBlockEditorInnerProps) {
  const blurCheckboxId = `${idPrefix}-blurred-by-default`

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={value.language}
        onValueChange={(language) => {
          if (language === 'javascript' || language === 'typescript') {
            onChange({ ...value, language })
          }
        }}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="typescript">TypeScript</SelectItem>
        </SelectContent>
      </Select>

      <div className="overflow-hidden rounded-md border border-input">
        <CodeMirror
          value={value.value}
          extensions={[getLanguageExtension(value.language)]}
          basicSetup={{ lineNumbers: true }}
          onChange={(nextValue) => onChange({ ...value, value: nextValue })}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={blurCheckboxId}
          checked={value.blurredByDefault}
          onCheckedChange={(checked) =>
            onChange({ ...value, blurredByDefault: checked })
          }
        />
        <Label htmlFor={blurCheckboxId}>Blured by default</Label>
      </div>
    </div>
  )
}
