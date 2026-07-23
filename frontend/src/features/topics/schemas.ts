import { z } from 'zod'

export const createTopicFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Topic name is required')
    .max(100, 'Name must be 100 characters or less'),
})

export type CreateTopicFormValues = z.infer<typeof createTopicFormSchema>

export const updateTopicFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Topic name is required')
    .max(100, 'Name must be 100 characters or less'),
})

export type UpdateTopicFormValues = z.infer<typeof updateTopicFormSchema>
