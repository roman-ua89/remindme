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
        dotClassName: 'bg-marker-needs-edit',
        pressedClassName: 'aria-pressed:border-marker-needs-edit aria-pressed:bg-marker-needs-edit/15 aria-pressed:text-foreground',
    },
    {
        value: ENTITY_MARKER.toRemove,
        label: 'To remove',
        dotClassName: 'bg-marker-to-remove',
        pressedClassName: 'aria-pressed:border-marker-to-remove aria-pressed:bg-marker-to-remove/15 aria-pressed:text-foreground',
    },
];
