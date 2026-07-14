import { z } from 'zod'

export const MAX_ENTITY_BLOCKS = 20

export const blockTypeSchema = z.enum(['text', 'code', 'image', 'list'])
export const entityVisibilitySchema = z.enum(['included', 'excluded'])
export const codeLanguageSchema = z.enum(['javascript', 'typescript'])

export const codeContentJsonSchema = z.object({
  language: codeLanguageSchema,
  value: z.string(),
})

export const listBlockRowSchema = z.object({
  leftValue: z.string(),
  rightValue: z.string(),
})

const positionSchema = z.number().int().min(0).max(MAX_ENTITY_BLOCKS - 1)

export const saveEntityBlockSchema = z.discriminatedUnion('blockType', [
  z.object({
    blockType: z.literal('text'),
    position: positionSchema,
    contentJson: z.record(z.string(), z.unknown()),
  }),
  z.object({
    blockType: z.literal('code'),
    position: positionSchema,
    contentJson: codeContentJsonSchema,
  }),
  z.object({
    blockType: z.literal('image'),
    position: positionSchema,
    mediaAssetId: z.string().uuid(),
  }),
  z.object({
    blockType: z.literal('list'),
    position: positionSchema,
    rows: z.array(listBlockRowSchema).min(1),
  }),
])

export const saveEntitySchema = z.object({
  title: z.string().trim().min(1).max(500),
  blocks: z.array(saveEntityBlockSchema).max(MAX_ENTITY_BLOCKS),
})

export const updateEntitySchema = z.object({
  title: z.string().trim().min(1).max(500).optional(),
  blocks: z.array(saveEntityBlockSchema).max(MAX_ENTITY_BLOCKS).optional(),
  visibility: entityVisibilitySchema.optional(),
})

export const entityListItemSchema = z.object({
  id: z.string().uuid(),
  topicId: z.string().uuid(),
  title: z.string(),
  revisedCount: z.number().int().nonnegative(),
  skippedCount: z.number().int().nonnegative(),
  visibility: entityVisibilitySchema,
  position: z.number().int().nonnegative(),
})

export const entityBlockResponseSchema = z.discriminatedUnion('blockType', [
  z.object({
    id: z.string().uuid(),
    blockType: z.literal('text'),
    position: positionSchema,
    contentJson: z.record(z.string(), z.unknown()),
  }),
  z.object({
    id: z.string().uuid(),
    blockType: z.literal('code'),
    position: positionSchema,
    contentJson: codeContentJsonSchema,
  }),
  z.object({
    id: z.string().uuid(),
    blockType: z.literal('image'),
    position: positionSchema,
    mediaAssetId: z.string().uuid(),
    mediaUrl: z.string().optional(),
  }),
  z.object({
    id: z.string().uuid(),
    blockType: z.literal('list'),
    position: positionSchema,
    rows: z.array(
      listBlockRowSchema.extend({
        id: z.string().uuid(),
        position: z.number().int().nonnegative(),
      }),
    ),
  }),
])

export const entitySchema = entityListItemSchema.extend({
  blocks: z.array(entityBlockResponseSchema),
})

export const entityIdParamsSchema = z.object({
  categoryId: z.string().uuid(),
  topicId: z.string().uuid(),
  entityId: z.string().uuid(),
})

export type BlockType = z.infer<typeof blockTypeSchema>
export type EntityVisibility = z.infer<typeof entityVisibilitySchema>
export type SaveEntityBlock = z.infer<typeof saveEntityBlockSchema>
export type SaveEntityInput = z.infer<typeof saveEntitySchema>
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>
export type EntityListItem = z.infer<typeof entityListItemSchema>
export type EntityBlockResponse = z.infer<typeof entityBlockResponseSchema>
export type Entity = z.infer<typeof entitySchema>
export type EntityIdParams = z.infer<typeof entityIdParamsSchema>
