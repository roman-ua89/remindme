import { z } from 'zod'

export const createCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(100, 'Name must be 100 characters or less'),
})

export type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>
