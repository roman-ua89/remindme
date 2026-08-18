import { z } from 'zod'

import { entitySchema } from './entities.js'

export const playerScopeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('category'),
    categoryId: z.string().uuid(),
  }),
  z.object({
    type: z.literal('topic'),
    topicId: z.string().uuid(),
  }),
  z.object({
    type: z.literal('entity'),
    entityId: z.string().uuid(),
  }),
])

export const playerBatchRequestSchema = z.object({
  scope: playerScopeSchema,
  excludeEntityIds: z.array(z.string().uuid()).default([]),
  limit: z.number().int().min(1).max(100),
})

export const playerBatchItemSchema = entitySchema.extend({
  categoryId: z.string().uuid(),
})

export const playerBatchResponseSchema = z.object({
  items: z.array(playerBatchItemSchema),
})

export type PlayerApiScope = z.infer<typeof playerScopeSchema>
export type PlayerBatchRequest = z.infer<typeof playerBatchRequestSchema>
export type PlayerBatchItem = z.infer<typeof playerBatchItemSchema>
export type PlayerBatchResponse = z.infer<typeof playerBatchResponseSchema>
