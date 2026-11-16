import { describe, expect, it } from 'vitest';
import { getPaginationSkip, toPaginatedResponse } from './pagination.js';

describe('getPaginationSkip', () => {
    it('starts at 0 for the first page', () => {
        expect(getPaginationSkip({ page: 1, pageSize: 20 })).toBe(0);
    });

    it('skips whole pages of pageSize items', () => {
        expect(getPaginationSkip({ page: 3, pageSize: 20 })).toBe(40);
    });

    it('works with pageSize 1', () => {
        expect(getPaginationSkip({ page: 5, pageSize: 1 })).toBe(4);
    });
});

describe('toPaginatedResponse', () => {
    it('keeps items, page and pageSize and rounds totalPages up', () => {
        const items = ['a', 'b'];

        expect(toPaginatedResponse(items, 21, { page: 2, pageSize: 10 })).toEqual({
            items,
            page: 2,
            pageSize: 10,
            totalItems: 21,
            totalPages: 3,
        });
    });

    it('does not add an extra page when totalItems is an exact multiple of pageSize', () => {
        expect(toPaginatedResponse([], 40, { page: 1, pageSize: 20 }).totalPages).toBe(2);
    });

    it('returns totalPages 0 when there are no items', () => {
        expect(toPaginatedResponse([], 0, { page: 1, pageSize: 20 })).toEqual({
            items: [],
            page: 1,
            pageSize: 20,
            totalItems: 0,
            totalPages: 0,
        });
    });
});
