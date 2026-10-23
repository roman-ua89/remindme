import { z } from 'zod'

import { paginatedResponseSchema } from './common/pagination.js'

export const MAX_ENTITY_BLOCKS = 20

export const blockTypeSchema = z.enum(['text', 'code', 'image', 'list', 'link'])
export const entityVisibilitySchema = z.enum(['included', 'excluded'])
export const codeLanguageSchema = z.enum(['javascript', 'typescript'])

export const ENTITY_MARKER = {
  needsEdit: 1,
  toRemove: 2,
} as const

export const entityMarkerSchema = z.union([
  z.literal(ENTITY_MARKER.needsEdit),
  z.literal(ENTITY_MARKER.toRemove),
])

export const codeContentJsonSchema = z.object({
  language: codeLanguageSchema,
  value: z.string(),
  blurredByDefault: z.boolean(),
})

export const listBlockRowSchema = z.object({
  leftValue: z.string(),
  rightValue: z.string(),
})

export const listBlockContentJsonSchema = z.object({
  blurRightSideByDefault: z.boolean(),
})

export const MAX_LINK_TITLE_LENGTH = 75

export const linkContentJsonSchema = z.object({
  title: z.string().trim().max(MAX_LINK_TITLE_LENGTH),
  url: z
    .string()
    .trim()
    .max(2000)
    .url()
    .refine((value) => /^https?:\/\//i.test(value), 'URL must start with http:// or https://'),
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
    contentJson: listBlockContentJsonSchema,
    rows: z.array(listBlockRowSchema).min(1),
  }),
  z.object({
    blockType: z.literal('link'),
    position: positionSchema,
    contentJson: linkContentJsonSchema,
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

export const setEntityMarkerSchema = z.object({
  marker: entityMarkerSchema.nullable(),
})

export const entityListItemSchema = z.object({
  id: z.string().uuid(),
  topicId: z.string().uuid(),
  title: z.string(),
  revisedCount: z.number().int().nonnegative(),
  skippedCount: z.number().int().nonnegative(),
  visibility: entityVisibilitySchema,
  marker: entityMarkerSchema.nullable(),
  position: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
  /** Set only when saved from Constructor edit mode; null = never edited */
  editedAt: z.string().nullable(),
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
    contentJson: listBlockContentJsonSchema,
    rows: z.array(
      listBlockRowSchema.extend({
        id: z.string().uuid(),
        position: z.number().int().nonnegative(),
      }),
    ),
  }),
  z.object({
    id: z.string().uuid(),
    blockType: z.literal('link'),
    position: positionSchema,
    contentJson: z.object({ title: z.string(), url: z.string() }),
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

export const entityByIdParamsSchema = z.object({
  entityId: z.string().uuid(),
})

export const entityListPageSchema = paginatedResponseSchema(entityListItemSchema)

export type CodeContentJson = z.infer<typeof codeContentJsonSchema>
export type ListBlockContentJson = z.infer<typeof listBlockContentJsonSchema>
export type LinkContentJson = z.infer<typeof linkContentJsonSchema>
export type BlockType = z.infer<typeof blockTypeSchema>
export type EntityVisibility = z.infer<typeof entityVisibilitySchema>
export type EntityMarker = z.infer<typeof entityMarkerSchema>
export type SetEntityMarkerInput = z.infer<typeof setEntityMarkerSchema>
export type SaveEntityBlock = z.infer<typeof saveEntityBlockSchema>
export type SaveEntityInput = z.infer<typeof saveEntitySchema>
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>
export type EntityListItem = z.infer<typeof entityListItemSchema>
export type EntityBlockResponse = z.infer<typeof entityBlockResponseSchema>
export type Entity = z.infer<typeof entitySchema>
export type EntityIdParams = z.infer<typeof entityIdParamsSchema>
export type EntityByIdParams = z.infer<typeof entityByIdParamsSchema>
export type EntityListPage = z.infer<typeof entityListPageSchema>
