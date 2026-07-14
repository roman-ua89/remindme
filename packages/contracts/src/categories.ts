import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  topicCount: z.number().int().nonnegative(),
})

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  firstTopicName: z.string().trim().min(1).max(100).optional(),
})

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
})

export const categoryIdParamsSchema = z.object({
  categoryId: z.string().uuid(),
})

export type Category = z.infer<typeof categorySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CategoryIdParams = z.infer<typeof categoryIdParamsSchema>
