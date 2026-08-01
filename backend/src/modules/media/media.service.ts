import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

import type { MediaAsset } from '@remindme/contracts/media'

import type { AuthUser } from '../../middleware/auth.js'
import { badRequest } from '../../lib/errors.js'
import { prisma } from '../../lib/prisma.js'
import { env } from '../../config/env.js'
import { mediaUrl } from '../../lib/media-url.js'

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

function toMediaAssetDto(asset: {
  id: string
  mimeType: string
  byteSize: bigint
  originalFilename: string | null
  storageKey: string
}): MediaAsset {
  return {
    id: asset.id,
    mimeType: asset.mimeType,
    byteSize: Number(asset.byteSize),
    originalFilename: asset.originalFilename,
    url: mediaUrl(asset.storageKey),
  }
}

export async function ensureUploadDir() {
  await fs.mkdir(env.UPLOAD_DIR, { recursive: true })
}

export async function uploadMedia(
  user: AuthUser,
  file: Express.Multer.File,
): Promise<MediaAsset> {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw badRequest('Unsupported file type')
  }

  if (file.size > env.MAX_UPLOAD_BYTES) {
    throw badRequest('File is too large')
  }

  await ensureUploadDir()

  const extension = path.extname(file.originalname) || ''
  const storageKey = `${crypto.randomUUID()}${extension}`
  const destination = path.join(env.UPLOAD_DIR, storageKey)

  await fs.writeFile(destination, file.buffer)

  const asset = await prisma.mediaAsset.create({
    data: {
      userId: user.id,
      storageKey,
      mimeType: file.mimetype,
      byteSize: BigInt(file.size),
      originalFilename: file.originalname,
    },
  })

  return toMediaAssetDto(asset)
}

export async function getMediaFile(storageKey: string) {
  const asset = await prisma.mediaAsset.findFirst({
    where: { storageKey },
  })

  if (!asset) {
    return null
  }

  const filePath = path.join(env.UPLOAD_DIR, storageKey)
  return {
    asset,
    filePath,
  }
}

export async function deleteMediaAssetsIfUnreferenced(mediaAssetIds: string[]) {
  if (mediaAssetIds.length === 0) {
    return
  }

  for (const mediaAssetId of mediaAssetIds) {
    const referenceCount = await prisma.entityBlock.count({
      where: { mediaAssetId },
    })

    if (referenceCount > 0) {
      continue
    }

    const asset = await prisma.mediaAsset.findUnique({
      where: { id: mediaAssetId },
    })

    if (!asset) {
      continue
    }

    const filePath = path.join(env.UPLOAD_DIR, asset.storageKey)
    await fs.unlink(filePath).catch(() => undefined)

    await prisma.mediaAsset.delete({ where: { id: mediaAssetId } })
  }
}
