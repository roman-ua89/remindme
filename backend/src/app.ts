import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { categoriesRoutes } from './modules/categories/categories.routes.js';
import { entitiesRoutes } from './modules/entities/entities.routes.js';
import { mediaRoutes } from './modules/media/media.routes.js';
import { topicsRoutes } from './modules/topics/topics.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { openApiSpec } from './openapi/spec.js';
import { ensureUploadDir } from './modules/media/media.service.js';

export async function createApp() {
    await ensureUploadDir();

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
    api.use('/auth', authRoutes);
    api.use('/categories', categoriesRoutes);
    api.use('/categories/:categoryId/topics', topicsRoutes);
    api.use('/categories/:categoryId/topics/:topicId/entities', entitiesRoutes);
    api.use('/media', mediaRoutes);
    api.use('/users', usersRoutes);

    app.use('/api/v1', api);
    app.use(errorHandler);

    return app;
}
