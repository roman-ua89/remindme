import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

import { validationError } from '../lib/errors.js'

type ValidationSchemas = {
  body?: ZodType
  params?: ZodType
  query?: ZodType
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const fieldErrors: Array<{ field: string; message: string }> = []

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body)
      if (!result.success) {
        for (const issue of result.error.issues) {
          fieldErrors.push({
            field: issue.path.join('.') || 'body',
            message: issue.message,
          })
        }
      } else {
        req.body = result.data
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params)
      if (!result.success) {
        for (const issue of result.error.issues) {
          fieldErrors.push({
            field: issue.path.join('.') || 'params',
            message: issue.message,
          })
        }
      } else {
        req.params = result.data as Request['params']
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query)
      if (!result.success) {
        for (const issue of result.error.issues) {
          fieldErrors.push({
            field: issue.path.join('.') || 'query',
            message: issue.message,
          })
        }
      } else {
        req.query = result.data as Request['query']
      }
    }

    if (fieldErrors.length > 0) {
      return next(validationError(fieldErrors))
    }

    next()
  }
}
