import { z } from 'zod'

/** Optional in the URL; callers should use `search.page ?? 1`. */
export const listPageSearchSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
})

export type ListPageSearch = z.infer<typeof listPageSearchSchema>
