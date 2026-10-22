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
})

/** Sparse: only days with at least one Done/Skip are returned. */
export const dailyActivityResponseSchema = z.object({
  month: activityMonthSchema,
  days: z.array(dailyActivityDaySchema),
  /** Earliest local day (`YYYY-MM-DD`) with any activity for this user; `null` if none. Lower bound for month paging. */
  firstActivityDate: z.string().nullable(),
})

export type DailyActivityQuery = z.infer<typeof dailyActivityQuerySchema>
export type DailyActivityDay = z.infer<typeof dailyActivityDaySchema>
export type DailyActivityResponse = z.infer<typeof dailyActivityResponseSchema>
