import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createLocalStorage } from './storage.js';

// storage.ts validates env when it is imported. The local driver takes its folder as an argument, so a stub is enough here.
vi.mock('../config/env.js', () => ({
    env: { STORAGE_DRIVER: 'local', UPLOAD_DIR: './uploads', BLOB_READ_WRITE_TOKEN: undefined },
}));

describe('local storage driver', () => {
    let uploadDir: string;

    beforeEach(async () => {
        uploadDir = await fs.mkdtemp(path.join(os.tmpdir(), 'remindme-storage-'));
    });

    afterEach(async () => {
        await fs.rm(uploadDir, { recursive: true, force: true });
    });

    it('save writes the bytes under the key and returns the key as the storageKey', async () => {
        const storage = createLocalStorage(uploadDir);
        const data = Buffer.from('png-bytes');

        const storageKey = await storage.save('photo.png', data, 'image/png');

        expect(storageKey).toBe('photo.png');
        expect(await fs.readFile(path.join(uploadDir, 'photo.png'))).toEqual(data);
    });

    it('save creates the upload folder when it does not exist yet', async () => {
        const nestedDir = path.join(uploadDir, 'nested');
        const storage = createLocalStorage(nestedDir);

        await storage.save('photo.png', Buffer.from('x'), 'image/png');

        expect(await fs.readFile(path.join(nestedDir, 'photo.png'), 'utf8')).toBe('x');
    });

    it('read returns the absolute path of the stored file', async () => {
        const storage = createLocalStorage(uploadDir);
        const data = Buffer.from('png-bytes');
        const storageKey = await storage.save('photo.png', data, 'image/png');

        const file = await storage.read(storageKey);

        if (file.type !== 'file') {
            throw new Error('expected a local file');
        }
        expect(file.path).toBe(path.join(uploadDir, 'photo.png'));
        expect(await fs.readFile(file.path)).toEqual(data);
    });

    it('delete removes the stored file', async () => {
        const storage = createLocalStorage(uploadDir);
        const storageKey = await storage.save('photo.png', Buffer.from('x'), 'image/png');

        await storage.delete(storageKey);

        await expect(fs.access(path.join(uploadDir, 'photo.png'))).rejects.toThrow();
    });

    it('ensureReady creates the upload folder', async () => {
        const nestedDir = path.join(uploadDir, 'ready');
        const storage = createLocalStorage(nestedDir);

        await storage.ensureReady();

        expect((await fs.stat(nestedDir)).isDirectory()).toBe(true);
    });
});
