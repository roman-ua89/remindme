import { z } from 'zod'

import { categoryIdParamsSchema } from './categories.js'
import { paginatedResponseSchema } from './common/pagination.js'
import { entityMarkerSchema } from './entities.js'

export const topicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  categoryId: z.string().uuid(),
  entityCount: z.number().int().nonnegative(),
  /** Distinct markers across the topic's entities, ascending */
  markers: z.array(entityMarkerSchema),
})

export const createTopicSchema = z.object({
  name: z.string().trim().min(1).max(100),
})

export const updateTopicSchema = z.object({
  name: z.string().trim().min(1).max(100),
})

export const topicIdParamsSchema = categoryIdParamsSchema.extend({
  topicId: z.string().uuid(),
})

export const topicListPageSchema = paginatedResponseSchema(topicSchema)

export type Topic = z.infer<typeof topicSchema>
export type CreateTopicInput = z.infer<typeof createTopicSchema>
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>
export type TopicIdParams = z.infer<typeof topicIdParamsSchema>
export type TopicListPage = z.infer<typeof topicListPageSchema>
