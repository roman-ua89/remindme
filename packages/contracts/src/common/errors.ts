import { z } from 'zod'

export const fieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
})

export const apiErrorSchema = z.object({
  message: z.string(),
  messageKey: z.string().optional(),
  code: z.string().optional(),
  errors: z.array(fieldErrorSchema).optional(),
})

export type FieldError = z.infer<typeof fieldErrorSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
