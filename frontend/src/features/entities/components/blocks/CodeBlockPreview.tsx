import { useState } from 'react'
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
  const [revealed, setRevealed] = useState(false)
  const blurredByDefault = contentJson.blurredByDefault ?? false
  const isBlurred = blurredByDefault && !revealed

  const toggleRevealed = () => {
    if (blurredByDefault) {
      setRevealed((current) => !current)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{languageLabels[contentJson.language]}</p>
      <div
        className={
          isBlurred
            ? 'cursor-pointer select-none overflow-hidden rounded-md border border-input blur-sm'
            : 'overflow-hidden rounded-md border border-input'
        }
        onClick={toggleRevealed}
        onKeyDown={(event) => {
          if (!blurredByDefault) {
            return
          }

          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setRevealed((current) => !current)
          }
        }}
        role={blurredByDefault ? 'button' : undefined}
        tabIndex={blurredByDefault ? 0 : undefined}
      >
        <div className={isBlurred ? 'pointer-events-none' : undefined}>
          <CodeMirror
            value={contentJson.value}
            editable={false}
            extensions={[getLanguageExtension(contentJson.language)]}
            basicSetup={{ lineNumbers: true }}
          />
        </div>
      </div>
    </div>
  )
}
