# Form Examples

## Complete page

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FieldError } from '@/components/shared/FieldError'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email'),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export const ProfileFormPage = () => {
  const { control, handleSubmit } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', email: '' },
  })

  const onSubmit = (values: ProfileFormValues) => {
    console.log(values)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" aria-invalid={fieldState.invalid} {...field} />
            <FieldError message={fieldState.error?.message} />
          </div>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" aria-invalid={fieldState.invalid} {...field} />
            <FieldError message={fieldState.error?.message} />
          </div>
        )}
      />

      <Button type="submit">Save</Button>
    </form>
  )
}
```

## Select

```tsx
import { Controller } from 'react-hook-form'
import { FieldError } from '@/components/shared/FieldError'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Controller
  control={control}
  name="language"
  render={({ field, fieldState }) => (
    <div className="grid gap-2">
      <Label>Language *</Label>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger aria-invalid={fieldState.invalid}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="typescript">TypeScript</SelectItem>
        </SelectContent>
      </Select>
      <FieldError message={fieldState.error?.message} />
    </div>
  )}
/>
```

## Nested field in a field array

```tsx
<Controller
  control={control}
  name={`blocks.${index}.mediaAssetId`}
  render={({ field, fieldState }) => (
    <div className="grid gap-2">
      <ImageUploader value={field.value} onChange={field.onChange} />
      <FieldError message={fieldState.error?.message} />
    </div>
  )}
/>
```

## Array-level error

When the schema validates the whole array (e.g. `.min(1, 'Add at least one block')`):

```tsx
<Controller
  control={control}
  name="blocks"
  render={({ fieldState }) => <FieldError message={fieldState.error?.message} />}
/>
```

Place this below the list UI so the message appears once for the group.
