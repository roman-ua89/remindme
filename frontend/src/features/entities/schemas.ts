import { z } from 'zod'

import { MAX_ENTITY_BLOCKS } from '@/features/entities/types'

const codeLanguageSchema = z.enum(['javascript', 'typescript'])

const codeContentJsonSchema = z.object({
  language: codeLanguageSchema,
  value: z.string(),
})

const listBlockRowSchema = z.object({
  leftValue: z.string(),
  rightValue: z.string(),
})

const textBlockFormSchema = z.object({
  clientId: z.string(),
  blockType: z.literal('text'),
  contentJson: z.record(z.string(), z.unknown()),
})

const codeBlockFormSchema = z.object({
  clientId: z.string(),
  blockType: z.literal('code'),
  contentJson: codeContentJsonSchema,
})

const imageBlockFormSchema = z.object({
  clientId: z.string(),
  blockType: z.literal('image'),
  mediaAssetId: z.string().min(1, 'Image is required'),
  previewUrl: z.string().optional(),
})

const listBlockFormSchema = z.object({
  clientId: z.string(),
  blockType: z.literal('list'),
  rows: z.array(listBlockRowSchema).min(1, 'List must have at least one row'),
})

const entityBlockFormSchema = z.discriminatedUnion('blockType', [
  textBlockFormSchema,
  codeBlockFormSchema,
  imageBlockFormSchema,
  listBlockFormSchema,
])

export const entityConstructorFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  blocks: z
    .array(entityBlockFormSchema)
    .max(MAX_ENTITY_BLOCKS, `Maximum ${MAX_ENTITY_BLOCKS} blocks allowed`),
})

export const saveEntitySchema = z.object({
  title: z.string().trim().min(1),
  blocks: z
    .array(
      z.discriminatedUnion('blockType', [
        z.object({
          blockType: z.literal('text'),
          position: z.number().int().min(0).max(MAX_ENTITY_BLOCKS - 1),
          contentJson: z.record(z.string(), z.unknown()),
        }),
        z.object({
          blockType: z.literal('code'),
          position: z.number().int().min(0).max(MAX_ENTITY_BLOCKS - 1),
          contentJson: codeContentJsonSchema,
        }),
        z.object({
          blockType: z.literal('image'),
          position: z.number().int().min(0).max(MAX_ENTITY_BLOCKS - 1),
          mediaAssetId: z.string().uuid(),
        }),
        z.object({
          blockType: z.literal('list'),
          position: z.number().int().min(0).max(MAX_ENTITY_BLOCKS - 1),
          rows: z.array(listBlockRowSchema).min(1),
        }),
      ]),
    )
    .max(MAX_ENTITY_BLOCKS),
})

export type EntityConstructorFormInput = z.infer<
  typeof entityConstructorFormSchema
>
