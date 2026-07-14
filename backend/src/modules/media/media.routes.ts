import path from 'node:path'

import { Router } from 'express'
import multer from 'multer'

import { auth } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/require-permission.js'
import { notFound } from '../../lib/errors.js'
import { env } from '../../config/env.js'
import * as mediaService from './media.service.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_BYTES },
})

const router = Router()

router.use(auth, requirePermission('content:manage_own'))

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return next(notFound('No file uploaded'))
    }

    const asset = await mediaService.uploadMedia(req.user!, req.file)
    res.status(201).json(asset)
  } catch (error) {
    next(error)
  }
})

router.get('/files/:storageKey', async (req, res, next) => {
  try {
    const result = await mediaService.getMediaFile(req.params.storageKey)
    if (!result) {
      return next(notFound('File not found'))
    }

    res.type(result.asset.mimeType)
    res.sendFile(path.resolve(result.filePath))
  } catch (error) {
    next(error)
  }
})

export const mediaRoutes = router
