import { z } from 'zod'

export const mediaAssetSchema = z.object({
  id: z.string().uuid(),
  mimeType: z.string(),
  byteSize: z.number().int().nonnegative(),
  originalFilename: z.string().nullable(),
  url: z.string(),
})

export const uploadMediaResponseSchema = mediaAssetSchema

export type MediaAsset = z.infer<typeof mediaAssetSchema>
export type UploadMediaResponse = z.infer<typeof uploadMediaResponseSchema>
