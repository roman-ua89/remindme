import CodeMirror from '@uiw/react-codemirror'

import type { CodeContentJson } from '@/features/entities/types'
import { getLanguageExtension } from '@/lib/codemirror/languages'

const languageLabels: Record<CodeContentJson['language'], string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
}

type CodeBlockPreviewProps = {
  contentJson: CodeContentJson
}

export function CodeBlockPreview({ contentJson }: CodeBlockPreviewProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{languageLabels[contentJson.language]}</p>
      <div className="overflow-hidden rounded-md border border-input">
        <CodeMirror
          value={contentJson.value}
          editable={false}
          extensions={[getLanguageExtension(contentJson.language)]}
          basicSetup={{ lineNumbers: true }}
        />
      </div>
    </div>
  )
}
