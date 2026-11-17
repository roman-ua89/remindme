export function mediaUrl(storageKey: string) {
    // vercel-blob stores the public blob URL as the storageKey, so it is already the final URL.
    if (/^https?:\/\//.test(storageKey)) {
        return storageKey;
    }
    return `/api/v1/media/files/${storageKey}`;
}
