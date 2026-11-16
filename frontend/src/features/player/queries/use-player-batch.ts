import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getApiErrorMessage } from '@/lib/auth';
import type { PlayerScope } from '@/features/player/types';
import { fetchNextBatch } from '@/features/player/utils/session';

type FetchPlayerBatchVariables = {
    scope: PlayerScope;
    shownEntityIds: string[];
};

export function usePlayerBatch() {
    return useMutation({
        mutationFn: ({ scope, shownEntityIds }: FetchPlayerBatchVariables) => fetchNextBatch({ scope, shownEntityIds }),
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
