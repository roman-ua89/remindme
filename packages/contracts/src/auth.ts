import { z } from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(100, 'Email must be 100 characters or less')
  .email('Enter a valid email')

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(64, 'Password must be 64 characters or less'),
  displayName: z.string().min(1).max(100).optional(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(64, 'Password must be 64 characters or less'),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(64, 'Password must be 64 characters or less'),
})

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
})

export const authMessageSchema = z.object({
  message: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type User = z.infer<typeof userSchema>
export type AuthMessage = z.infer<typeof authMessageSchema>
