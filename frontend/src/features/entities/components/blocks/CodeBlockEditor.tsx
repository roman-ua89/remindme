import CodeMirror from '@uiw/react-codemirror'
import type { Control, FieldPath } from 'react-hook-form'
import { Controller } from 'react-hook-form'

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

export function CodeBlockEditor({ control, name }: CodeBlockEditorProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <CodeBlockEditorInner
          value={(field.value as CodeContentJson) ?? { language: 'javascript', value: '' }}
          onChange={field.onChange}
        />
      )}
    />
  )
}

type CodeBlockEditorInnerProps = {
  value: CodeContentJson
  onChange: (value: CodeContentJson) => void
}

function CodeBlockEditorInner({ value, onChange }: CodeBlockEditorInnerProps) {
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
    </div>
  )
}
