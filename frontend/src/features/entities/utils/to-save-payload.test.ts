import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';

import type { EntityBlockForm, EntityConstructorFormValues } from '@/features/entities/types';
import { toSaveEntityPayload } from '@/features/entities/utils/to-save-payload';

const MEDIA_ID = '6f1c2b8e-9a4d-4c3e-8f2a-1b2c3d4e5f60';

describe('toSaveEntityPayload', () => {
    it('trims the title and numbers blocks by their order', () => {
        const values: EntityConstructorFormValues = {
            title: '  Photosynthesis  ',
            blocks: [
                { clientId: 'a', blockType: 'text', contentJson: { type: 'doc' } },
                { clientId: 'b', blockType: 'code', contentJson: { language: 'typescript', value: 'const x = 1;', blurredByDefault: true } },
            ],
        };

        expect(toSaveEntityPayload(values)).toStrictEqual({
            title: 'Photosynthesis',
            blocks: [
                { blockType: 'text', position: 0, contentJson: { type: 'doc' } },
                { blockType: 'code', position: 1, contentJson: { language: 'typescript', value: 'const x = 1;', blurredByDefault: true } },
            ],
        });
    });

    it('sends only the media id for image blocks', () => {
        const values: EntityConstructorFormValues = {
            title: 'Diagram',
            blocks: [{ clientId: 'img', blockType: 'image', mediaAssetId: MEDIA_ID, previewUrl: 'blob:http://localhost/abc' }],
        };

        expect(toSaveEntityPayload(values).blocks).toStrictEqual([{ blockType: 'image', position: 0, mediaAssetId: MEDIA_ID }]);
    });

    it('keeps list rows and link content, trimming link fields', () => {
        const values: EntityConstructorFormValues = {
            title: 'Vocabulary',
            blocks: [
                {
                    clientId: 'list',
                    blockType: 'list',
                    contentJson: { blurRightSideByDefault: true },
                    rows: [{ leftValue: 'Cat', rightValue: 'Kot' }],
                },
                { clientId: 'link', blockType: 'link', contentJson: { title: ' Docs ', url: ' https://example.com/docs ' } },
            ],
        };

        expect(toSaveEntityPayload(values).blocks).toStrictEqual([
            { blockType: 'list', position: 0, contentJson: { blurRightSideByDefault: true }, rows: [{ leftValue: 'Cat', rightValue: 'Kot' }] },
            { blockType: 'link', position: 1, contentJson: { title: 'Docs', url: 'https://example.com/docs' } },
        ]);
    });

    it('accepts an entity without blocks', () => {
        expect(toSaveEntityPayload({ title: 'Empty', blocks: [] })).toStrictEqual({ title: 'Empty', blocks: [] });
    });

    it('throws when the trimmed title is empty', () => {
        expect(() => toSaveEntityPayload({ title: '   ', blocks: [] })).toThrow(ZodError);
    });

    it('accepts exactly 20 blocks, numbered 0 to 19', () => {
        const blocks = Array.from({ length: 20 }, (_, index): EntityBlockForm => ({
            clientId: `text-${index}`,
            blockType: 'text',
            contentJson: {},
        }));

        const payload = toSaveEntityPayload({ title: 'Full', blocks });

        expect(payload.blocks.map((block) => block.position)).toStrictEqual(Array.from({ length: 20 }, (_, index) => index));
    });

    it('throws when there are more blocks than an entity can hold', () => {
        // Spec: up to 20 ordered blocks, so 20 + 1 is one too many.
        const blocks = Array.from({ length: 20 + 1 }, (_, index): EntityBlockForm => ({
            clientId: `text-${index}`,
            blockType: 'text',
            contentJson: {},
        }));

        let thrown: unknown;
        try {
            toSaveEntityPayload({ title: 'Too many', blocks });
        } catch (error) {
            thrown = error;
        }

        expect(thrown).toBeInstanceOf(ZodError);
        expect((thrown as ZodError).issues).toContainEqual(expect.objectContaining({ code: 'too_big', path: ['blocks'] }));
    });

    it('throws when a link URL is not http or https', () => {
        const values: EntityConstructorFormValues = {
            title: 'Links',
            blocks: [{ clientId: 'link', blockType: 'link', contentJson: { title: 'FTP', url: 'ftp://example.com' } }],
        };

        expect(() => toSaveEntityPayload(values)).toThrow(ZodError);
    });

    it('throws when a list block has no rows', () => {
        const values: EntityConstructorFormValues = {
            title: 'Empty list',
            blocks: [{ clientId: 'list', blockType: 'list', contentJson: { blurRightSideByDefault: false }, rows: [] }],
        };

        expect(() => toSaveEntityPayload(values)).toThrow(ZodError);
    });
});
