import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  User,
} from '@remindme/contracts/auth'

import { prisma } from '../../lib/prisma.js'
import {
  badRequest,
  conflict,
  notFound,
  unauthorized,
} from '../../lib/errors.js'
import { signToken } from '../../lib/jwt.js'

const BCRYPT_COST = 12

async function getUserAuthProfile(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  })

  if (!user || !user.isActive) {
    throw unauthorized()
  }

  const roles = user.userRoles.map((userRole) => userRole.role.code)
  const permissions = [
    ...new Set(
      user.userRoles.flatMap((userRole) =>
        userRole.role.rolePermissions.map(
          (rolePermission) => rolePermission.permission.code,
        ),
      ),
    ),
  ]

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    roles,
    permissions,
  }
}

export async function register(input: RegisterInput): Promise<User> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (existing) {
    throw conflict('Email is already registered')
  }

  const userRole = await prisma.role.findUnique({
    where: { code: 'user' },
  })

  if (!userRole) {
    throw badRequest('Default user role is not configured')
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST)

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      displayName: input.displayName ?? null,
      userRoles: {
        create: { roleId: userRole.id },
      },
    },
  })

  return getUserAuthProfile(user.id)
}

export async function login(input: LoginInput): Promise<{ user: User; token: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (!user || !user.isActive) {
    throw unauthorized('Invalid email or password')
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash)
  if (!valid) {
    throw unauthorized('Invalid email or password')
  }

  const profile = await getUserAuthProfile(user.id)
  const token = signToken({
    sub: profile.id,
    roles: profile.roles,
    permissions: profile.permissions,
  })

  return { user: profile, token }
}

export async function getCurrentUser(userId: string): Promise<User> {
  return getUserAuthProfile(userId)
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<{ message: string; resetToken?: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  })

  if (!user) {
    return { message: 'If the email exists, a reset link has been sent' }
  }

  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  })

  const response: { message: string; resetToken?: string } = {
    message: 'If the email exists, a reset link has been sent',
  }

  if (process.env.NODE_ENV === 'development') {
    response.resetToken = rawToken
  }

  return response
}

export async function resetPassword(
  input: ResetPasswordInput,
): Promise<{ message: string }> {
  const tokenHash = crypto
    .createHash('sha256')
    .update(input.token)
    .digest('hex')

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  })

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt < new Date()
  ) {
    throw badRequest('Invalid or expired reset token')
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ])

  return { message: 'Password has been reset' }
}

export { getUserAuthProfile }
