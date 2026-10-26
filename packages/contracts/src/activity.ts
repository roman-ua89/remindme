import { z } from 'zod'

/** `YYYY-MM` month, e.g. `2026-10`. */
export const activityMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format')

export const dailyActivityQuerySchema = z.object({
  month: activityMonthSchema,
})

export const dailyActivityDaySchema = z.object({
  /** User's local calendar day, `YYYY-MM-DD`. */
  date: z.string(),
  revisedCount: z.number().int(),
  skippedCount: z.number().int(),
  /** Seconds the Player was open on this day. */
  playerSeconds: z.number().int(),
})

/** Sparse: only days with any activity (Done/Skip or Player time) are returned. */
export const dailyActivityResponseSchema = z.object({
  month: activityMonthSchema,
  days: z.array(dailyActivityDaySchema),
  /** Earliest local day (`YYYY-MM-DD`) with any activity for this user; `null` if none. Lower bound for month paging. */
  firstActivityDate: z.string().nullable(),
})

/** Max seconds accepted per Player-time report; the client reports every ~30s, so this only rejects bogus values. */
export const PLAYER_TIME_MAX_SECONDS_PER_REPORT = 300

export const recordPlayerTimeBodySchema = z.object({
  seconds: z
    .number({ message: 'Seconds must be a number' })
    .int('Seconds must be a whole number')
    .min(1, 'Seconds must be at least 1')
    .max(PLAYER_TIME_MAX_SECONDS_PER_REPORT, `Seconds must be at most ${PLAYER_TIME_MAX_SECONDS_PER_REPORT}`),
})

/** Today's counters (user's local day from `X-Timezone`); zeros when nothing was recorded yet. */
export const todayActivityResponseSchema = dailyActivityDaySchema

export type DailyActivityQuery = z.infer<typeof dailyActivityQuerySchema>
export type DailyActivityDay = z.infer<typeof dailyActivityDaySchema>
export type DailyActivityResponse = z.infer<typeof dailyActivityResponseSchema>
export type RecordPlayerTimeBody = z.infer<typeof recordPlayerTimeBodySchema>
export type TodayActivityResponse = z.infer<typeof todayActivityResponseSchema>
