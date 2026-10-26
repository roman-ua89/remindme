import { Timer } from 'lucide-react';

import { formatDuration } from '@/features/player/utils/format-duration';
import { cn } from '@/lib/utils';

type PlayerTimerProps = {
    /** Today's Player time; `null` while loading. */
    seconds: number | null;
    goalMinutes: number;
};

export const PlayerTimer = ({ seconds, goalMinutes }: PlayerTimerProps) => {
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
};
