import { describe, expect, it } from 'vitest';

import { loginFormSchema } from '@/features/auth/schemas';

const VALID = { email: 'user@example.com', password: 'secret' };

const messagesFor = (input: unknown) => {
    const result = loginFormSchema.safeParse(input);

    return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe('loginFormSchema', () => {
    it('requires an email', () => {
        expect(messagesFor({ ...VALID, email: '' })).toContain('Email is required');
    });

    it('rejects a malformed email', () => {
        expect(messagesFor({ ...VALID, email: 'not-an-email' })).toContain('Enter a valid email');
    });

    it('trims surrounding spaces from the email and accepts it', () => {
        const parsed = loginFormSchema.parse({ ...VALID, email: '  user@example.com  ' });

        expect(parsed.email).toBe('user@example.com');
    });

    it('rejects an email longer than 100 characters', () => {
        const email = `${'a'.repeat(89)}@example.com`;

        expect(email).toHaveLength(101);
        expect(messagesFor({ ...VALID, email })).toContain('Email must be 100 characters or less');
    });

    it('accepts an email of exactly 100 characters', () => {
        const email = `${'a'.repeat(88)}@example.com`;

        expect(email).toHaveLength(100);
        expect(loginFormSchema.safeParse({ ...VALID, email }).success).toBe(true);
    });

    it('requires a password', () => {
        expect(messagesFor({ ...VALID, password: '' })).toContain('Password is required');
    });

    it('rejects a password longer than 64 characters', () => {
        expect(messagesFor({ ...VALID, password: 'a'.repeat(65) })).toContain('Password must be 64 characters or less');
    });

    it('accepts a password of exactly 64 characters', () => {
        expect(loginFormSchema.safeParse({ ...VALID, password: 'a'.repeat(64) }).success).toBe(true);
    });

    it('accepts a valid email and password', () => {
        expect(loginFormSchema.safeParse(VALID).success).toBe(true);
    });
});
