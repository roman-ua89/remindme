import { Router } from 'express';

import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '@remindme/contracts/auth';
import { MessageKey, messages } from '@remindme/contracts/messages';

import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { AUTH_COOKIE_NAME } from '../../lib/jwt.js';
import { env } from '../../config/env.js';
import { SESSION_MAX_AGE_MS } from '../../config/session.js';
import * as authService from './auth.service.js';

const router = Router();

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
};

router.post('/register', validate({ body: registerSchema }), async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        const { token } = await authService.login({
            email: req.body.email,
            password: req.body.password,
        });
        res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/login', validate({ body: loginSchema }), async (req, res, next) => {
    try {
        const { user, token } = await authService.login(req.body);
        res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/logout', (_req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    res.json({
        message: messages[MessageKey.AUTH_LOGGED_OUT],
        messageKey: MessageKey.AUTH_LOGGED_OUT,
    });
});

router.get('/me', auth, async (req, res, next) => {
    try {
        const user = await authService.getCurrentUser(req.user!.id);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/forgot-password', validate({ body: forgotPasswordSchema }), async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/reset-password', validate({ body: resetPasswordSchema }), async (req, res, next) => {
    try {
        const result = await authService.resetPassword(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export const authRoutes = router;
