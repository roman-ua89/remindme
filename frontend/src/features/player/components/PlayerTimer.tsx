import { memo } from 'react';

import { PlayerTimeDisplay } from '@/features/player/components/PlayerTimeDisplay';
import { usePlayerTimer } from '@/features/player/hooks/use-player-timer';

type PlayerTimerProps = {
    goalMinutes: number;
};

/**
 * Owns the timer state so the per-second tick re-renders only this component, not the Player content
 * (re-rendering the content every second breaks text selection). Memoized so Player re-renders skip it.
 */
export const PlayerTimer = memo(({ goalMinutes }: PlayerTimerProps) => {
    const seconds = usePlayerTimer();

    return <PlayerTimeDisplay seconds={seconds} goalMinutes={goalMinutes} />;
});

PlayerTimer.displayName = 'PlayerTimer';
