import { z } from 'zod'

/** Player seconds that earn one drop: every full 10 minutes. */
export const SECONDS_PER_DROP = 600
/** Most drops one local day can earn (30 minutes of Player time). */
export const MAX_DROPS_PER_DAY = 3
/** Drops needed for each level above 1. */
export const DROPS_PER_LEVEL = 3
/** Highest level; the tree stage stops here too. */
export const MAX_LEVEL = 6

/** The logged-in user's score, derived from their Player time on every request. */
export const scoreResponseSchema = z.object({
  /** Drops with no upper limit; each idle past day takes one away, floor 0. */
  totalDrops: z.number().int().min(0),
  /** `min(floor(totalDrops / DROPS_PER_LEVEL) + 1, MAX_LEVEL)`. */
  level: z.number().int().min(1).max(MAX_LEVEL),
  /** Tree illustration stage; equal to `level`. */
  treeStage: z.number().int().min(1).max(MAX_LEVEL),
  /** Sun gradation, `ceil(level / 2)`. */
  sunGradation: z.number().int().min(1).max(3),
  /** Drops earned today, from 0 up to `maxPerDay`. */
  earnedToday: z.number().int().min(0).max(MAX_DROPS_PER_DAY),
  /** Daily cap on earned drops. */
  maxPerDay: z.number().int().min(1),
  /** True when decay since the last active day lowered the level and today has not earned a drop yet. */
  levelLost: z.boolean(),
})

export type ScoreResponse = z.infer<typeof scoreResponseSchema>
