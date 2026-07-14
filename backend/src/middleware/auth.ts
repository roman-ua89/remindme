import type { NextFunction, Request, Response } from 'express'

import { unauthorized } from '../lib/errors.js'
import { AUTH_COOKIE_NAME, verifyToken } from '../lib/jwt.js'

export type AuthUser = {
  id: string
  roles: string[]
  permissions: string[]
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function auth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME]
  if (!token || typeof token !== 'string') {
    return next(unauthorized())
  }

  try {
    const payload = verifyToken(token)
    req.user = {
      id: payload.sub,
      roles: payload.roles,
      permissions: payload.permissions,
    }
    next()
  } catch {
    next(unauthorized('Invalid or expired session'))
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME]
  if (!token || typeof token !== 'string') {
    return next()
  }

  try {
    const payload = verifyToken(token)
    req.user = {
      id: payload.sub,
      roles: payload.roles,
      permissions: payload.permissions,
    }
  } catch {
    // ignore invalid token for optional auth
  }

  next()
}
