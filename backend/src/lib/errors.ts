import { MessageKey, messages, type MessageKeyValue } from '@remindme/contracts/messages';

export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly code?: string,
        public readonly errors?: Array<{ field: string; message: string }>,
        public readonly messageKey?: MessageKeyValue,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function keyedError(
    messageKey: MessageKeyValue,
    statusCode: number,
    code?: string,
    errors?: Array<{ field: string; message: string }>,
) {
    return new AppError(messages[messageKey], statusCode, code, errors, messageKey);
}

export function badRequest(message: string, errors?: Array<{ field: string; message: string }>) {
    return new AppError(message, 400, 'BAD_REQUEST', errors);
}

export function badRequestKey(messageKey: MessageKeyValue, errors?: Array<{ field: string; message: string }>) {
    return keyedError(messageKey, 400, 'BAD_REQUEST', errors);
}

export function unauthorized(messageKey: MessageKeyValue = MessageKey.AUTH_UNAUTHORIZED) {
    return keyedError(messageKey, 401, 'UNAUTHORIZED');
}

export function forbidden(message = 'Forbidden') {
    return new AppError(message, 403, 'FORBIDDEN');
}

export function notFound(message = 'Not found') {
    return new AppError(message, 404, 'NOT_FOUND');
}

export function conflict(messageOrKey: string | MessageKeyValue) {
    if (messageOrKey in messages) {
        return keyedError(messageOrKey as MessageKeyValue, 409, 'CONFLICT');
    }
    return new AppError(messageOrKey, 409, 'CONFLICT');
}

export function validationError(errors: Array<{ field: string; message: string }>) {
    return new AppError('Validation failed', 422, 'VALIDATION_ERROR', errors);
}
