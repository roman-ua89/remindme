import { z } from 'zod'

/** Totals for the current user's library (Home "Your library"). Entities include both visibilities. */
export const libraryStatsResponseSchema = z.object({
  categoriesCount: z.number().int(),
  topicsCount: z.number().int(),
  entitiesCount: z.number().int(),
})

export type LibraryStatsResponse = z.infer<typeof libraryStatsResponseSchema>
