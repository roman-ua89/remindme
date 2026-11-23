import { startTransition, useOptimistic } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ENTITY_MARKER_OPTIONS } from '@/features/entities/markers';
import type { EntityMarker } from '@/features/entities/types';
import { cn } from '@/lib/utils';

type EntityMarkerToggleProps = {
    value: EntityMarker | null;
    /** Persists the marker; must update the source of `value` before resolving. Rejection rolls the toggle back. */
    onChange: (marker: EntityMarker | null) => Promise<unknown>;
    disabled?: boolean;
    className?: string;
};

export const EntityMarkerToggle = ({ value, onChange, disabled, className }: EntityMarkerToggleProps) => {
    const [optimisticValue, setOptimisticValue] = useOptimistic(value);

    function handleValueChange(groupValue: string[]) {
        const next = groupValue.length > 0 ? (Number(groupValue[0]) as EntityMarker) : null;

        startTransition(async () => {
            setOptimisticValue(next);
            try {
                await onChange(next);
            } catch {
                // Error is surfaced by the mutation; useOptimistic reverts to `value` once the transition ends.
            }
        });
    }

    return (
        <ToggleGroup
            variant='outline'
            size='sm'
            spacing={2}
            aria-label='Entity marker'
            disabled={disabled}
            value={optimisticValue === null ? [] : [String(optimisticValue)]}
            onValueChange={handleValueChange}
            className={cn('shrink-0', className)}
        >
            {ENTITY_MARKER_OPTIONS.map((option) => (
                <ToggleGroupItem
                    key={option.value}
                    value={String(option.value)}
                    aria-label={option.label}
                    className={cn(
                        'rounded-full border-border bg-card px-3 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground',
                        option.pressedClassName,
                    )}
                >
                    <span className={cn('size-2 rounded-full', option.dotClassName)} aria-hidden />
                    {option.label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};
