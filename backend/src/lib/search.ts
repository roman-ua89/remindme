export function textContainsFilter(
    field: string,
    search: string | undefined,
): Record<string, { contains: string; mode: 'insensitive' }> | Record<string, never> {
    if (!search) {
        return {};
    }

    return { [field]: { contains: search, mode: 'insensitive' } };
}
