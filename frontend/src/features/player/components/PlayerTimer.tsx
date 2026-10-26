import { memo } from 'react';
import { Timer } from 'lucide-react';

import { usePlayerTimer } from '@/features/player/hooks/use-player-timer';
import { formatDuration } from '@/features/player/utils/format-duration';
import { cn } from '@/lib/utils';

type PlayerTimerProps = {
    goalMinutes: number;
};

/**
 * Owns the timer state so the per-second tick re-renders only this component, not the Player content
 * (re-rendering the content every second breaks text selection). Memoized so Player re-renders skip it.
 */
export const PlayerTimer = memo(({ goalMinutes }: PlayerTimerProps) => {
    /** Today's Player time; `null` while loading. */
    const seconds = usePlayerTimer();
    const isGoalReached = seconds !== null && seconds >= goalMinutes * 60;

    return (
        <div
            className='flex items-center gap-1.5 text-sm'
            title={isGoalReached ? `Daily goal of ${goalMinutes} min reached` : `Time in Player today · goal ${goalMinutes} min`}
        >
            <Timer className={cn('size-4 text-muted-foreground', isGoalReached && 'text-(--chart-revised)')} aria-hidden />
            <span className={cn('font-medium tabular-nums', isGoalReached && 'text-(--chart-revised)')}>
                {seconds === null ? '--:--' : formatDuration(seconds)}
            </span>
            <span className='text-muted-foreground'>/ {goalMinutes} min</span>
        </div>
    );
});

PlayerTimer.displayName = 'PlayerTimer';
