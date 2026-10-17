import { ApiClientError } from '@/lib/api-client';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
    if (error instanceof ApiClientError) {
        return error.message || fallback;
    }

    if (error instanceof Error) {
        return error.message || fallback;
    }

    return fallback;
}

export function isUnauthorizedError(error: unknown) {
    return error instanceof ApiClientError && error.statusCode === 401;
}

/** Pages anyone can open without signing in. */
const PUBLIC_PATHNAMES = ['/'];

/**
 * Where the root guard should send the visitor, or `null` to let them through.
 * Every redirect goes to the public home page; `openLogin` opens the login dialog there.
 */
export function getAuthRedirect(options: { isAuthenticated: boolean; pathname: string }): { openLogin: boolean } | null {
    const isAuthRoute = options.pathname === '/auth' || options.pathname.startsWith('/auth/');
    const isPublicRoute = PUBLIC_PATHNAMES.includes(options.pathname);

    if (options.isAuthenticated && isAuthRoute) return { openLogin: false };
    if (!options.isAuthenticated && !isAuthRoute && !isPublicRoute) return { openLogin: true };
    return null;
}
