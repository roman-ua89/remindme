import { ENTITY_MARKER_OPTIONS } from '@/features/entities/markers';
import type { EntityMarker } from '@/features/entities/types';
import { cn } from '@/lib/utils';

const DEFAULT_HIDDEN_LABEL = 'Hidden from the Player';

type EntityMarkerDotsProps = {
    markers: EntityMarker[];
    /** Adds a hidden-marker dot left of the marker dots when the item is excluded from the Player */
    hidden?: boolean;
    /** Tooltip and aria-label of the hidden-marker dot */
    hiddenLabel?: string;
};

export const EntityMarkerDots = ({ markers, hidden = false, hiddenLabel = DEFAULT_HIDDEN_LABEL }: EntityMarkerDotsProps) => {
    const options = ENTITY_MARKER_OPTIONS.filter((option) => markers.includes(option.value));

    if (!hidden && options.length === 0) {
        return null;
    }

    return (
        <span className='flex shrink-0 items-center gap-2'>
            {hidden ? (
                <span role='img' className='size-2 shrink-0 rounded-full bg-marker-hidden' title={hiddenLabel} aria-label={hiddenLabel} />
            ) : null}
            {options.map((option) => (
                <span
                    key={option.value}
                    role='img'
                    className={cn('size-2 shrink-0 rounded-full', option.dotClassName)}
                    title={option.label}
                    aria-label={option.label}
                />
            ))}
        </span>
    );
};
