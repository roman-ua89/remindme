import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

import { validationError } from '../lib/errors.js';

type ValidationSchemas = {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
};

/**
 * Express 5 exposes `req.query` as a getter-only property, so direct
 * assignment throws. Replace it with a data property for this request.
 */
function setRequestQuery(req: Request, value: unknown) {
    Object.defineProperty(req, 'query', {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
    });
}

export function validate(schemas: ValidationSchemas) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const fieldErrors: Array<{ field: string; message: string }> = [];

        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    fieldErrors.push({
                        field: issue.path.join('.') || 'body',
                        message: issue.message,
                    });
                }
            } else {
                req.body = result.data;
            }
        }

        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    fieldErrors.push({
                        field: issue.path.join('.') || 'params',
                        message: issue.message,
                    });
                }
            } else {
                req.params = result.data as Request['params'];
            }
        }

        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                for (const issue of result.error.issues) {
                    fieldErrors.push({
                        field: issue.path.join('.') || 'query',
                        message: issue.message,
                    });
                }
            } else {
                setRequestQuery(req, result.data);
            }
        }

        if (fieldErrors.length > 0) {
            return next(validationError(fieldErrors));
        }

        next();
    };
}
