import { z } from 'zod'

export const adminUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  isActive: z.boolean(),
  roles: z.array(z.string()),
  createdAt: z.string().datetime(),
})

export const updateUserSchema = z.object({
  isActive: z.boolean().optional(),
  displayName: z.string().min(1).max(100).nullable().optional(),
  roleCodes: z.array(z.string()).optional(),
})

export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
})

export type AdminUser = z.infer<typeof adminUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserIdParams = z.infer<typeof userIdParamsSchema>
