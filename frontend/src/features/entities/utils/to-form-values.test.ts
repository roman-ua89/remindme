import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Entity, EntityBlockResponse } from '@remindme/contracts/entities';

import { toEntityFormValues } from '@/features/entities/utils/to-form-values';

const ENTITY_ID = '3d7a1f2e-1b2c-4d5e-8f90-a1b2c3d4e5f6';
const TOPIC_ID = '9b8c7d6e-5f4a-4b3c-8d2e-1f0a9b8c7d6e';
const MEDIA_ID = '6f1c2b8e-9a4d-4c3e-8f2a-1b2c3d4e5f60';

function uuid(n: number): string {
    return `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
}

function makeEntity(blocks: EntityBlockResponse[]): Entity {
    return {
        id: ENTITY_ID,
        topicId: TOPIC_ID,
        title: 'Cell structure',
        revisedCount: 2,
        skippedCount: 1,
        visibility: 'included',
        marker: null,
        position: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
        editedAt: '2026-01-02T00:00:00.000Z',
        blocks,
    };
}

// Positions are deliberately out of order: the mapper must sort by position.
const blocks: EntityBlockResponse[] = [
    { id: uuid(1), blockType: 'link', position: 4, contentJson: { title: 'Docs', url: 'https://example.com/docs' } },
    { id: uuid(2), blockType: 'text', position: 1, contentJson: { type: 'doc' } },
    { id: uuid(3), blockType: 'code', position: 0, contentJson: { language: 'javascript', value: 'console.log(1);', blurredByDefault: true } },
    { id: uuid(4), blockType: 'image', position: 3, mediaAssetId: MEDIA_ID, mediaUrl: '/uploads/cell.png' },
    {
        id: uuid(5),
        blockType: 'list',
        position: 2,
        contentJson: { blurRightSideByDefault: false },
        rows: [{ id: uuid(6), position: 0, leftValue: 'Nucleus', rightValue: 'Control center' }],
    },
];

describe('toEntityFormValues', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('sorts blocks by position and keeps the title', () => {
        const result = toEntityFormValues(makeEntity(blocks));

        expect(result.title).toBe('Cell structure');
        expect(result.blocks.map((block) => block.blockType)).toStrictEqual(['code', 'text', 'list', 'image', 'link']);
    });

    it('gives each block a unique client id and drops server-only fields', () => {
        const result = toEntityFormValues(makeEntity(blocks));
        const clientIds = result.blocks.map((block) => block.clientId);

        expect(clientIds.every((clientId) => clientId.length > 0)).toBe(true);
        expect(new Set(clientIds).size).toBe(blocks.length);

        for (const block of result.blocks) {
            expect(block).not.toHaveProperty('id');
            expect(block).not.toHaveProperty('position');
        }
    });

    it('maps list rows to their left and right values only', () => {
        const result = toEntityFormValues(makeEntity(blocks));

        expect(result.blocks[2]).toEqual({
            clientId: expect.any(String),
            blockType: 'list',
            contentJson: { blurRightSideByDefault: false },
            rows: [{ leftValue: 'Nucleus', rightValue: 'Control center' }],
        });
    });

    it('resolves relative image media URLs against the API origin', () => {
        vi.stubEnv('VITE_API_URL', 'https://api.example.test/api/v1');

        const result = toEntityFormValues(makeEntity(blocks));

        // Sorted order: code, text, list, image, link.
        expect(result.blocks[3]).toMatchObject({
            blockType: 'image',
            mediaAssetId: MEDIA_ID,
            previewUrl: 'https://api.example.test/uploads/cell.png',
        });
    });

    it('keeps absolute media URLs and leaves the preview empty without a media URL', () => {
        const result = toEntityFormValues(
            makeEntity([
                { id: uuid(7), blockType: 'image', position: 0, mediaAssetId: MEDIA_ID, mediaUrl: 'https://cdn.example.com/cell.png' },
                { id: uuid(8), blockType: 'image', position: 1, mediaAssetId: MEDIA_ID },
            ]),
        );

        expect(result.blocks[0]).toMatchObject({ previewUrl: 'https://cdn.example.com/cell.png' });
        expect(result.blocks[1]).toEqual({ clientId: expect.any(String), blockType: 'image', mediaAssetId: MEDIA_ID, previewUrl: undefined });
    });
});
