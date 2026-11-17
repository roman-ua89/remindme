import 'dotenv/config';

import type { IncomingMessage, ServerResponse } from 'node:http';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { activityRoutes } from './modules/activity/activity.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { categoriesRoutes } from './modules/categories/categories.routes.js';
import { entitiesFlatRoutes } from './modules/entities/entities-flat.routes.js';
import { entitiesRoutes } from './modules/entities/entities.routes.js';
import { mediaRoutes } from './modules/media/media.routes.js';
import { playerRoutes } from './modules/player/player.routes.js';
import { statsRoutes } from './modules/stats/stats.routes.js';
import { topicsRoutes } from './modules/topics/topics.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { openApiSpec } from './openapi/spec.js';
import { storage } from './lib/storage.js';

export async function createApp() {
    await storage.ensureReady();

    const app = express();

    app.use(
        pinoHttp({
            autoLogging: env.NODE_ENV !== 'test',
        }),
    );

    app.use(
        cors({
            origin: env.CORS_ORIGIN,
            credentials: true,
        }),
    );

    app.use(express.json({ limit: '2mb' }));
    app.use(cookieParser());

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });

    if (env.NODE_ENV === 'development') {
        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
    }

    const api = express.Router();
    api.get('/health', (_req, res) => {
        res.json({ status: 'ok', commit: process.env.APP_COMMIT_SHA ?? 'local' });
    });
    api.use('/activity', activityRoutes);
    api.use('/auth', authRoutes);
    api.use('/categories', categoriesRoutes);
    api.use('/categories/:categoryId/topics', topicsRoutes);
    api.use('/categories/:categoryId/topics/:topicId/entities', entitiesRoutes);
    api.use('/entities', entitiesFlatRoutes);
    api.use('/media', mediaRoutes);
    api.use('/player', playerRoutes);
    api.use('/stats', statsRoutes);
    api.use('/users', usersRoutes);

    app.use('/api/v1', api);
    app.use(errorHandler);

    return app;
}

// Vercel Function handler: one app per function instance, reused by later requests to that instance.
let appPromise: ReturnType<typeof createApp> | undefined;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    appPromise ??= createApp();
    let app: Awaited<ReturnType<typeof createApp>>;
    try {
        app = await appPromise;
    } catch (error) {
        // Do not cache a failed start-up: the next request retries createApp().
        appPromise = undefined;
        throw error;
    }
    return app(req, res);
}
