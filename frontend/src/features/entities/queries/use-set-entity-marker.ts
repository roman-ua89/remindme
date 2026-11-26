import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { setEntityMarker } from '@/features/entities/api';
import { ENTITY_MARKER_OPTIONS } from '@/features/entities/markers';
import type { Entity, EntityMarker } from '@remindme/contracts/entities';
import { getApiErrorMessage } from '@/lib/auth';
import { queryKeys } from '@/lib/query-keys';

type SetEntityMarkerVariables = {
    categoryId: string;
    topicId: string;
    entityId: string;
    marker: EntityMarker | null;
};

function getMarkerToastMessage(marker: EntityMarker | null): string {
    if (marker === null) return 'Marker cleared';
    const option = ENTITY_MARKER_OPTIONS.find((item) => item.value === marker);
    return option ? `Marked as ${option.label}` : 'Marker updated';
}

export function useSetEntityMarker() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ categoryId, topicId, entityId, marker }: SetEntityMarkerVariables) => setEntityMarker(categoryId, topicId, entityId, marker),
        onSuccess: (updated, { categoryId, topicId, entityId }) => {
            // Write the confirmed marker into the detail cache synchronously so the optimistic UI settles on it.
            queryClient.setQueryData<Entity>(queryKeys.entities.detail(categoryId, topicId, entityId), (current) =>
                current ? { ...current, marker: updated.marker } : current,
            );
            queryClient.invalidateQueries({
                queryKey: [...queryKeys.entities.all(categoryId, topicId), 'list'],
            });
            queryClient.invalidateQueries({
                queryKey: [...queryKeys.topics.all(categoryId), 'list'],
            });
            queryClient.invalidateQueries({
                queryKey: [...queryKeys.categories.all, 'list'],
            });
            toast.success(getMarkerToastMessage(updated.marker));
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
}
