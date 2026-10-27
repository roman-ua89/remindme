import { useTodayActivity } from '@/features/activity/queries/use-today-activity';
import { PlayerTimeDisplay } from '@/features/player/components/PlayerTimeDisplay';
import { PLAYER_DAILY_GOAL_MINUTES } from '@/features/player/constants';

/**
 * Today's saved Player time for the app header (static: time only counts inside the Player).
 * Refetched on every header mount; leaving the Player invalidates it.
 */
export const TodayPlayerTime = () => {
    const { data, isError } = useTodayActivity();

    if (isError) {
        return null;
    }

    return <PlayerTimeDisplay seconds={data?.playerSeconds ?? null} goalMinutes={PLAYER_DAILY_GOAL_MINUTES} goalClassName='hidden sm:inline' />;
};
