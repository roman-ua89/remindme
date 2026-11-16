import { useCallback, useMemo, useState } from 'react';

import { debounce } from '@/lib/debounce';

type UseListSearchOptions = {
    minLength?: number;
    debounceMs?: number;
    onSearchChange?: () => void;
};

export function useListSearch({ minLength = 3, debounceMs = 500, onSearchChange }: UseListSearchOptions = {}) {
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState<string | undefined>();

    const debouncedApplySearch = useMemo(
        () =>
            debounce((value: string) => {
                const trimmed = value.trim();
                setSearchQuery(trimmed.length >= minLength ? trimmed : undefined);
                onSearchChange?.();
            }, debounceMs),
        [debounceMs, minLength, onSearchChange],
    );

    const handleInputChange = useCallback(
        (value: string) => {
            setInputValue(value);
            debouncedApplySearch(value);
        },
        [debouncedApplySearch],
    );

    const clearSearch = useCallback(() => {
        setInputValue('');
        setSearchQuery(undefined);
    }, []);

    return {
        inputValue,
        searchQuery,
        isSearchActive: Boolean(searchQuery),
        handleInputChange,
        clearSearch,
    };
}
