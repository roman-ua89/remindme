import fs from 'node:fs/promises';
import path from 'node:path';

import { del, put } from '@vercel/blob';

import { env } from '../config/env.js';

/** What the files route serves: a file on local disk, or a public URL to redirect to. */
export type StoredFile = { type: 'file'; path: string } | { type: 'redirect'; url: string };

export interface StorageDriver {
    /** Prepares the store for writes. Only the local driver has work to do (creates the upload folder). */
    ensureReady(): Promise<void>;
    /** Stores the bytes under `key` and returns the storageKey to save on the media asset. */
    save(key: string, data: Buffer, mimeType: string): Promise<string>;
    /** Resolves a storageKey saved on a media asset. */
    read(storageKey: string): Promise<StoredFile>;
    /** Removes the stored bytes for a storageKey. */
    delete(storageKey: string): Promise<void>;
}

export function createLocalStorage(uploadDir: string): StorageDriver {
    async function ensureUploadDir() {
        await fs.mkdir(uploadDir, { recursive: true });
    }

    return {
        ensureReady: ensureUploadDir,

        async save(key, data) {
            await ensureUploadDir();
            await fs.writeFile(path.join(uploadDir, key), data);
            return key;
        },

        async read(storageKey) {
            return { type: 'file', path: path.resolve(path.join(uploadDir, storageKey)) };
        },

        async delete(storageKey) {
            await fs.unlink(path.join(uploadDir, storageKey));
        },
    };
}

/** The storageKey is the public blob URL returned by `put`, so the database holds the URL itself. Never touches local disk. */
export function createVercelBlobStorage(token: string): StorageDriver {
    return {
        async ensureReady() {},

        async save(key, data, mimeType) {
            const blob = await put(key, data, { access: 'public', contentType: mimeType, token });
            return blob.url;
        },

        async read(storageKey) {
            return { type: 'redirect', url: storageKey };
        },

        async delete(storageKey) {
            await del(storageKey, { token });
        },
    };
}

function createStorageFromEnv(): StorageDriver {
    if (env.STORAGE_DRIVER === 'vercel-blob') {
        if (!env.BLOB_READ_WRITE_TOKEN) {
            throw new Error('BLOB_READ_WRITE_TOKEN is required when STORAGE_DRIVER is vercel-blob');
        }
        return createVercelBlobStorage(env.BLOB_READ_WRITE_TOKEN);
    }
    return createLocalStorage(env.UPLOAD_DIR);
}

export const storage = createStorageFromEnv();
