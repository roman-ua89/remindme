---
name: react-hook-form-zod
description: Implements forms with react-hook-form and Zod schema validation via zodResolver. Ensures every input displays a field-level error message. Use when creating or editing forms, form fields, validation schemas, or when the user mentions react-hook-form, zod, form validation, or error messages.
---

# React Hook Form + Zod

## Requirements

Every form in this project must:

1. Use `react-hook-form` for state and submission
2. Use a Zod schema with `zodResolver` for validation
3. Display an error message for **every** registered input — no silent failures

## File layout

```
features/<feature>/
├── schemas.ts          # Zod schemas (form + API if different)
├── types.ts            # Domain types
└── components/
    └── MyFormPage.tsx  # useForm + handleSubmit
```

Keep schemas separate from components. Derive form input types with `z.infer<typeof schema>` when the schema is the source of truth.

## Schema rules

- Add user-facing messages to every constraint: `.min(1, 'Title is required')`, not bare `.min(1)`
- Use `.trim()` on string fields that reject whitespace-only input
- Use `z.discriminatedUnion` for variant shapes (e.g. block types)
- Split `formSchema` (UI shape) and `apiSchema` (payload shape) when they differ

```ts
import { z } from 'zod'

export const myFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  email: z.email('Enter a valid email'),
})

export type MyFormValues = z.infer<typeof myFormSchema>
```

## Form setup

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const form = useForm<MyFormValues>({
  resolver: zodResolver(myFormSchema),
  defaultValues: { title: '', email: '' },
})

const onSubmit = (values: MyFormValues) => {
  // transform to API payload if needed, then submit
}
```

Wrap fields in `<form onSubmit={form.handleSubmit(onSubmit)}>`. Use `type="button"` on non-submit buttons inside forms.

## Field pattern (required)

Use `Controller` for every input — including native inputs, selects, and custom editors. **Always** render `fieldState.error`.

### Standard text input

```tsx
import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/shared/FieldError'

<Controller
  control={control}
  name="title"
  render={({ field, fieldState }) => (
    <div className="grid gap-2">
      <Label htmlFor="title">Title *</Label>
      <Input
        id="title"
        aria-invalid={fieldState.invalid}
        {...field}
      />
      <FieldError message={fieldState.error?.message} />
    </div>
  )}
/>
```

### Shared error component

Create `FieldError` once and reuse everywhere:

```tsx
// components/shared/FieldError.tsx
type FieldErrorProps = { message?: string }

export const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}
```

If `FieldError` does not exist yet, create it before adding new forms.

## Custom / third-party inputs

Wrap non-`register`-able components in `Controller`. Pass `field.onChange` / `field.value` explicitly. Still render `FieldError` from `fieldState`.

```tsx
<Controller
  control={control}
  name={`blocks.${index}`}
  render={({ field, fieldState }) => (
    <div className="grid gap-2">
      <CustomEditor value={field.value} onChange={field.onChange} />
      <FieldError message={fieldState.error?.message} />
    </div>
  )}
/>
```

For nested object fields validated by Zod (e.g. `contentJson.language`), add a separate `Controller` per leaf input or surface the parent error on the group container.

## Field arrays

Use `useFieldArray` for dynamic lists. Each sub-field gets its own `Controller` **and** `FieldError`.

```tsx
const { fields, append, remove } = useFieldArray({ control, name: 'items' })

{fields.map((field, index) => (
  <Controller
    key={field.id}
    control={control}
    name={`items.${index}.name`}
    render={({ field: itemField, fieldState }) => (
      <div className="grid gap-2">
        <Input aria-invalid={fieldState.invalid} {...itemField} />
        <FieldError message={fieldState.error?.message} />
      </div>
    )}
  />
))}
```

Array-level errors (e.g. `.min(1, 'Add at least one item')`) belong on the array `Controller` or a wrapper around the list.

## Accessibility

- Set `aria-invalid={fieldState.invalid}` on every focusable input
- Pair `<Label htmlFor>` with matching `id` on inputs
- Use `aria-label` only when no visible label exists

## Checklist before finishing

- [ ] Zod schema exists with messages on all constraints
- [ ] `zodResolver` wired in `useForm`
- [ ] Every input uses `Controller` (or `register` + manual error lookup for simple native-only forms)
- [ ] Every input has `<FieldError message={fieldState.error?.message} />`
- [ ] `aria-invalid` set from `fieldState.invalid`
- [ ] Submit handler typed as `z.infer<typeof schema>`
- [ ] Non-submit buttons use `type="button"`

## Reference

For full examples (select, field array, nested blocks), see [examples.md](examples.md).

Canonical in-repo example: `EntityContentPanel` title field in `frontend/src/features/entities/components/EntityContentPanel.tsx`.
