import { ENTITY_MARKER_OPTIONS } from '@/features/entities/markers';
import type { EntityMarker } from '@/features/entities/types';
import { cn } from '@/lib/utils';

type EntityMarkerDotsProps = {
    markers: EntityMarker[];
};

export const EntityMarkerDots = ({ markers }: EntityMarkerDotsProps) => {
    const options = ENTITY_MARKER_OPTIONS.filter((option) => markers.includes(option.value));

    if (options.length === 0) {
        return null;
    }

    return (
        <span className='flex shrink-0 items-center gap-2'>
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
