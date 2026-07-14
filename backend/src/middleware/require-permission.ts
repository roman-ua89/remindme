import type { NextFunction, Request, Response } from 'express'

import { forbidden } from '../lib/errors.js'

export function requirePermission(...required: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(forbidden())
    }

    const hasPermission = required.some((permission) =>
      req.user!.permissions.includes(permission),
    )

    if (!hasPermission) {
      return next(forbidden())
    }

    next()
  }
}

export function hasPermission(user: Express.Request['user'], permission: string) {
  return user?.permissions.includes(permission) ?? false
}
