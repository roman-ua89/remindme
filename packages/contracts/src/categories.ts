import { z } from 'zod'

import { paginatedResponseSchema } from './common/pagination.js'

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  topicCount: z.number().int().nonnegative(),
  entityCount: z.number().int().nonnegative(),
  /** % of included entities already revised in the current Player round (scheduleCount above the category min) */
  completion: z.number().int().min(0).max(100),
})

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
})

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
})

export const categoryIdParamsSchema = z.object({
  categoryId: z.string().uuid(),
})

export const categoryListPageSchema = paginatedResponseSchema(categorySchema)

export type Category = z.infer<typeof categorySchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CategoryIdParams = z.infer<typeof categoryIdParamsSchema>
export type CategoryListPage = z.infer<typeof categoryListPageSchema>
