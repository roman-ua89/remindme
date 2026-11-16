import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../config/env.js';

export type JwtPayload = {
    sub: string;
    roles: string[];
    permissions: string[];
};

export function signToken(payload: JwtPayload): string {
    const options: SignOptions = {
        expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export const AUTH_COOKIE_NAME = 'remindme_token';
