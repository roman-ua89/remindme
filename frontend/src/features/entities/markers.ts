import { ENTITY_MARKER } from '@remindme/contracts/entities';

import type { EntityMarker } from '@/features/entities/types';

export type EntityMarkerOption = {
    value: EntityMarker;
    label: string;
    dotClassName: string;
    /** Applied to the toggle item while selected. */
    pressedClassName: string;
};

export const ENTITY_MARKER_OPTIONS: EntityMarkerOption[] = [
    {
        value: ENTITY_MARKER.needsEdit,
        label: 'Needs edit',
        dotClassName: 'bg-blue-500',
        pressedClassName: 'aria-pressed:border-blue-300 aria-pressed:bg-blue-50 aria-pressed:text-blue-700',
    },
    {
        value: ENTITY_MARKER.toRemove,
        label: 'To remove',
        dotClassName: 'bg-red-500',
        pressedClassName: 'aria-pressed:border-red-300 aria-pressed:bg-red-50 aria-pressed:text-red-700',
    },
];

export function getEntityMarkerOption(marker: EntityMarker | null): EntityMarkerOption | undefined {
    return ENTITY_MARKER_OPTIONS.find((option) => option.value === marker);
}
