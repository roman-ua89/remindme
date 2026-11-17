import { z } from 'zod';

import { SESSION_MAX_AGE_JWT } from './session.js';

const envSchema = z
    .object({
        NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
        PORT: z.coerce.number().int().positive().default(3000),
        DATABASE_URL: z.string().min(1),
        JWT_SECRET: z.string().min(16),
        JWT_EXPIRES_IN: z.string().default(SESSION_MAX_AGE_JWT),
        CORS_ORIGIN: z.string().url(),
        UPLOAD_DIR: z.string().default('./uploads'),
        MAX_UPLOAD_BYTES: z.coerce.number().int().positive().default(4_194_304),
        STORAGE_DRIVER: z.enum(['local', 'vercel-blob']).default('local'),
        BLOB_READ_WRITE_TOKEN: z.string().optional(),
    })
    .superRefine((value, ctx) => {
        if (value.STORAGE_DRIVER === 'vercel-blob' && !value.BLOB_READ_WRITE_TOKEN) {
            ctx.addIssue({
                code: 'custom',
                path: ['BLOB_READ_WRITE_TOKEN'],
                message: 'BLOB_READ_WRITE_TOKEN is required when STORAGE_DRIVER is vercel-blob',
            });
        }
    });

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
        process.exit(1);
    }
    return result.data;
}

export const env = loadEnv();
