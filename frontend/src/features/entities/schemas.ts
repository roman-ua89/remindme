import { z } from 'zod';

import { MAX_ENTITY_BLOCKS } from '@/features/entities/types';
import { constants } from '@/lib/constants';

const codeLanguageSchema = z.enum(['javascript', 'typescript']);

const codeContentJsonSchema = z.object({
    language: codeLanguageSchema,
    value: z.string(),
    blurredByDefault: z.boolean(),
});

const listBlockRowSchema = z.object({
    leftValue: z.string(),
    rightValue: z.string(),
});

const listBlockContentJsonSchema = z.object({
    blurRightSideByDefault: z.boolean(),
});

const linkContentJsonSchema = z.object({
    title: z.string().trim().max(constants.maxTitleSymbols, `Title must be at most ${constants.maxTitleSymbols} symbols`),
    url: z
        .string()
        .trim()
        .min(1, 'URL is required')
        .max(2000, 'URL must be at most 2000 symbols')
        .url('Enter a valid URL')
        .refine((value) => /^https?:\/\//i.test(value), 'URL must start with http:// or https://'),
});

const textBlockFormSchema = z.object({
    clientId: z.string(),
    blockType: z.literal('text'),
    contentJson: z.record(z.string(), z.unknown()),
});

const codeBlockFormSchema = z.object({
    clientId: z.string(),
    blockType: z.literal('code'),
    contentJson: codeContentJsonSchema,
});

const imageBlockFormSchema = z.object({
    clientId: z.string(),
    blockType: z.literal('image'),
    mediaAssetId: z.string().min(1, 'Image is required'),
    previewUrl: z.string().optional(),
});

const listBlockFormSchema = z.object({
    clientId: z.string(),
    blockType: z.literal('list'),
    contentJson: listBlockContentJsonSchema,
    rows: z.array(listBlockRowSchema).min(1, 'List must have at least one row'),
});

const linkBlockFormSchema = z.object({
    clientId: z.string(),
    blockType: z.literal('link'),
    contentJson: linkContentJsonSchema,
});

const entityBlockFormSchema = z.discriminatedUnion('blockType', [
    textBlockFormSchema,
    codeBlockFormSchema,
    imageBlockFormSchema,
    listBlockFormSchema,
    linkBlockFormSchema,
]);

export const entityConstructorFormSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    blocks: z.array(entityBlockFormSchema).max(MAX_ENTITY_BLOCKS, `Maximum ${MAX_ENTITY_BLOCKS} blocks allowed`),
});

export const saveEntitySchema = z.object({
    title: z.string().trim().min(1),
    blocks: z
        .array(
            z.discriminatedUnion('blockType', [
                z.object({
                    blockType: z.literal('text'),
                    position: z
                        .number()
                        .int()
                        .min(0)
                        .max(MAX_ENTITY_BLOCKS - 1),
                    contentJson: z.record(z.string(), z.unknown()),
                }),
                z.object({
                    blockType: z.literal('code'),
                    position: z
                        .number()
                        .int()
                        .min(0)
                        .max(MAX_ENTITY_BLOCKS - 1),
                    contentJson: codeContentJsonSchema,
                }),
                z.object({
                    blockType: z.literal('image'),
                    position: z
                        .number()
                        .int()
                        .min(0)
                        .max(MAX_ENTITY_BLOCKS - 1),
                    mediaAssetId: z.string().uuid(),
                }),
                z.object({
                    blockType: z.literal('list'),
                    position: z
                        .number()
                        .int()
                        .min(0)
                        .max(MAX_ENTITY_BLOCKS - 1),
                    contentJson: listBlockContentJsonSchema,
                    rows: z.array(listBlockRowSchema).min(1),
                }),
                z.object({
                    blockType: z.literal('link'),
                    position: z
                        .number()
                        .int()
                        .min(0)
                        .max(MAX_ENTITY_BLOCKS - 1),
                    contentJson: linkContentJsonSchema,
                }),
            ]),
        )
        .max(MAX_ENTITY_BLOCKS),
});

export type EntityConstructorFormInput = z.infer<typeof entityConstructorFormSchema>;
