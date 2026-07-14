import { useRef } from 'react'
import { ImageIcon, XIcon } from 'lucide-react'
import type { Control, FieldPath } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type {
  EntityConstructorFormValues,
  ImageBlockForm,
} from '@/features/entities/types'

type ImageBlockEditorProps = {
  control: Control<EntityConstructorFormValues>
  name: FieldPath<EntityConstructorFormValues>
}

export function ImageBlockEditor({ control, name }: ImageBlockEditorProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <ImageBlockEditorInner
          value={field.value as ImageBlockForm}
          onChange={field.onChange}
        />
      )}
    />
  )
}

type ImageBlockEditorInnerProps = {
  value: ImageBlockForm
  onChange: (value: ImageBlockForm) => void
}

function ImageBlockEditorInner({ value, onChange }: ImageBlockEditorInnerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith('image/')) return

    const mediaAssetId = crypto.randomUUID()
    const previewUrl = URL.createObjectURL(file)

    onChange({ ...value, mediaAssetId, previewUrl })
  }

  function handleRemove() {
    if (value.previewUrl) {
      URL.revokeObjectURL(value.previewUrl)
    }

    onChange({ ...value, mediaAssetId: '', previewUrl: undefined })
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    handleFile(event.dataTransfer.files[0])
  }

  if (value.mediaAssetId && value.previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-md border border-input bg-muted/30">
        <img
          src={value.previewUrl}
          alt="Uploaded preview"
          className="max-h-64 w-full object-contain"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="absolute top-2 right-2"
          aria-label="Remove image"
          onClick={handleRemove}
        >
          <XIcon />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex min-h-40 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-input bg-muted/20 px-4 py-8',
      )}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <ImageIcon className="size-8 text-muted-foreground" />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
        Choose image
      </Button>
      <p className="text-sm text-muted-foreground">or drag and drop</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  )
}
