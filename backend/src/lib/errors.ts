export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code?: string,
    public readonly errors?: Array<{ field: string; message: string }>,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function badRequest(
  message: string,
  errors?: Array<{ field: string; message: string }>,
) {
  return new AppError(message, 400, 'BAD_REQUEST', errors)
}

export function unauthorized(message = 'Unauthorized') {
  return new AppError(message, 401, 'UNAUTHORIZED')
}

export function forbidden(message = 'Forbidden') {
  return new AppError(message, 403, 'FORBIDDEN')
}

export function notFound(message = 'Not found') {
  return new AppError(message, 404, 'NOT_FOUND')
}

export function conflict(message: string) {
  return new AppError(message, 409, 'CONFLICT')
}

export function validationError(
  errors: Array<{ field: string; message: string }>,
) {
  return new AppError('Validation failed', 422, 'VALIDATION_ERROR', errors)
}
