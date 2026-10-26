/** Pack size for each Player batch. Later readable from profile settings. */
export const PLAYER_BATCH_SIZE = 3;

/** Daily Player-time goal choices (minutes). Later picked on the Settings page. */
export const PLAYER_DAILY_GOAL_OPTIONS = [15, 30, 60] as const;

export type PlayerDailyGoalMinutes = (typeof PLAYER_DAILY_GOAL_OPTIONS)[number];

/** Daily Player-time goal until it's readable from user settings. */
export const PLAYER_DAILY_GOAL_MINUTES: PlayerDailyGoalMinutes = 30;
