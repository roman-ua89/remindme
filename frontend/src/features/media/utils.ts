export function resolveMediaUrl(url: string): string {
    if (url.startsWith('http') || url.startsWith('blob:')) {
        return url;
    }

    const base = import.meta.env.VITE_API_URL ?? '/api/v1';

    // Only an absolute API base has an origin to prepend. A relative (same-origin) base resolves the media path against the page.
    if (!/^https?:\/\//.test(base)) {
        return url;
    }

    return `${new URL(base).origin}${url}`;
}
