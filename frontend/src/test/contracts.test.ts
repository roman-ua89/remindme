import { describe, expect, it } from 'vitest';

import { ENTITY_MARKER, MAX_ENTITY_BLOCKS, saveEntitySchema, setEntityMarkerSchema } from '@remindme/contracts/entities';
import { playerBatchRequestSchema } from '@remindme/contracts/player';

const CATEGORY_ID = '6f1c2b8e-9a4d-4c3e-8f2a-1b2c3d4e5f60';

function entityWithLink(url: string) {
    return { title: 'Links', blocks: [{ blockType: 'link', position: 0, contentJson: { title: 'Docs', url } }] };
}

describe('saveEntitySchema', () => {
    it('accepts a title with text and link blocks', () => {
        const result = saveEntitySchema.safeParse({
            title: 'Cells',
            blocks: [
                { blockType: 'text', position: 0, contentJson: { type: 'doc' } },
                { blockType: 'link', position: 1, contentJson: { title: 'Docs', url: 'https://example.com' } },
            ],
        });

        expect(result.success).toBe(true);
    });

    it('rejects a title that is blank after trimming', () => {
        expect(saveEntitySchema.safeParse({ title: '   ', blocks: [] }).success).toBe(false);
    });

    it('rejects more blocks than an entity can hold', () => {
        const blocks = Array.from({ length: MAX_ENTITY_BLOCKS + 1 }, () => ({ blockType: 'text', position: 0, contentJson: {} }));

        expect(saveEntitySchema.safeParse({ title: 'Too many', blocks }).success).toBe(false);
    });

    it('rejects a block position outside 0 to 19', () => {
        const blocks = [{ blockType: 'text', position: MAX_ENTITY_BLOCKS, contentJson: {} }];

        expect(saveEntitySchema.safeParse({ title: 'Cells', blocks }).success).toBe(false);
    });

    it('accepts only http and https link URLs', () => {
        expect(saveEntitySchema.safeParse(entityWithLink('https://example.com')).success).toBe(true);
        expect(saveEntitySchema.safeParse(entityWithLink('ftp://example.com')).success).toBe(false);
    });

    it('requires at least one row in list blocks', () => {
        const blocks = [{ blockType: 'list', position: 0, contentJson: { blurRightSideByDefault: false }, rows: [] }];

        expect(saveEntitySchema.safeParse({ title: 'Lists', blocks }).success).toBe(false);
    });
});

describe('setEntityMarkerSchema', () => {
    it('accepts both markers and clearing the marker', () => {
        const markers = [ENTITY_MARKER.needsEdit, ENTITY_MARKER.toRemove, null];

        expect(markers.every((marker) => setEntityMarkerSchema.safeParse({ marker }).success)).toBe(true);
    });

    it('rejects any other marker value', () => {
        expect(setEntityMarkerSchema.safeParse({ marker: 3 }).success).toBe(false);
    });
});

describe('playerBatchRequestSchema', () => {
    it('defaults excludeEntityIds to an empty list', () => {
        const result = playerBatchRequestSchema.parse({ scope: { type: 'category', categoryId: CATEGORY_ID }, limit: 3 });

        expect(result.excludeEntityIds).toStrictEqual([]);
    });

    it('limits a batch to 1 to 100 entities', () => {
        const request = (limit: number) => ({ scope: { type: 'category', categoryId: CATEGORY_ID }, limit });

        expect(playerBatchRequestSchema.safeParse(request(0)).success).toBe(false);
        expect(playerBatchRequestSchema.safeParse(request(100)).success).toBe(true);
        expect(playerBatchRequestSchema.safeParse(request(101)).success).toBe(false);
    });

    it('rejects scopes with an unknown type', () => {
        expect(playerBatchRequestSchema.safeParse({ scope: { type: 'library', categoryId: CATEGORY_ID }, limit: 3 }).success).toBe(false);
    });
});
