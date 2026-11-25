import { memo } from 'react';

import { NextDropChip } from '@/features/player/components/NextDropChip';
import { usePlayerTimer } from '@/features/player/hooks/use-player-timer';
import { formatDuration } from '@/features/player/utils/format-duration';
import { useScore } from '@/features/score/queries/use-score';

const RING_SIZE = 32;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type PlayerTimerProps = {
    goalMinutes: number;
};

type TimerRingProps = {
    /** 0 to 1, share of the daily goal reached. */
    progress: number;
};

const TimerRing = ({ progress }: TimerRingProps) => {
    return (
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden className='shrink-0 -rotate-90'>
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill='none' strokeWidth={RING_STROKE} className='stroke-timer-track' />
            <circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RING_RADIUS}
                fill='none'
                strokeWidth={RING_STROKE}
                strokeLinecap='round'
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
                className='stroke-timer-ring'
            />
        </svg>
    );
};

/**
 * Owns the timer state so the per-second tick re-renders only this component, not the Player content
 * (re-rendering the content every second breaks text selection). Memoized so Player re-renders skip it.
 * The next-drop chip renders here too, so it ticks with the timer; it stays hidden until the score has loaded.
 */
export const PlayerTimer = memo(({ goalMinutes }: PlayerTimerProps) => {
    const seconds = usePlayerTimer();
    const maxPerDay = useScore().data?.maxPerDay;
    const progress = seconds === null ? 0 : Math.min(seconds / (goalMinutes * 60), 1);

    return (
        <>
            <div
                className='flex h-11 items-center gap-2.5 rounded-full border border-border bg-card pr-4 pl-1.5 text-sm'
                title={`Time in Player today · goal ${goalMinutes} min`}
            >
                <TimerRing progress={progress} />
                <span className='font-semibold tabular-nums'>{seconds === null ? '--:--' : formatDuration(seconds)}</span>
                <span className='text-muted-foreground tabular-nums'>of {goalMinutes} min</span>
            </div>
            {seconds === null || maxPerDay === undefined ? null : <NextDropChip seconds={seconds} maxPerDay={maxPerDay} />}
        </>
    );
});

PlayerTimer.displayName = 'PlayerTimer';
