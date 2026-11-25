import { SECONDS_PER_DROP } from '@remindme/contracts/score';
import { Droplet } from 'lucide-react';

import { getNextDrop } from '@/features/player/utils/next-drop';

type NextDropChipProps = {
    /** Today's Player time in seconds. */
    seconds: number;
    maxPerDay: number;
};

/** Pill beside the timer: minutes to the next drop, or the daily cap once it is reached. */
export const NextDropChip = ({ seconds, maxPerDay }: NextDropChipProps) => {
    const nextDrop = getNextDrop(seconds, maxPerDay);
    const label = nextDrop.status === 'capped' ? `${maxPerDay}/${maxPerDay} today` : `Next drop in ${nextDrop.minutesLeft} min`;

    return (
        <div
            className='flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm text-muted-foreground'
            title={`1 drop per ${SECONDS_PER_DROP / 60} min in the Player, up to ${maxPerDay} a day`}
        >
            <Droplet className='size-4 shrink-0' aria-hidden />
            <span className='tabular-nums'>{label}</span>
        </div>
    );
};
