import { Timer } from 'lucide-react';

import { formatDuration } from '@/features/player/utils/format-duration';
import { cn } from '@/lib/utils';

type PlayerTimeDisplayProps = {
    /** Today's Player time; `null` while loading. */
    seconds: number | null;
    goalMinutes: number;
    className?: string;
    goalClassName?: string;
};

/** Today's Player time vs the daily goal; turns green once the goal is reached. Shared by the Player and the app header. */
export const PlayerTimeDisplay = ({ seconds, goalMinutes, className, goalClassName }: PlayerTimeDisplayProps) => {
    const isGoalReached = seconds !== null && seconds >= goalMinutes * 60;

    return (
        <div
            className={cn('flex items-center gap-1.5 text-sm', className)}
            title={isGoalReached ? `Daily goal of ${goalMinutes} min reached` : `Time in Player today · goal ${goalMinutes} min`}
        >
            <Timer className={cn('size-4 text-muted-foreground', isGoalReached && 'text-(--chart-revised)')} aria-hidden />
            <span className={cn('font-medium tabular-nums', isGoalReached && 'text-(--chart-revised)')}>
                {seconds === null ? '--:--' : formatDuration(seconds)}
            </span>
            <span className={cn('text-muted-foreground', goalClassName)}>/ {goalMinutes} min</span>
        </div>
    );
};
