import { Router } from 'express'

import {
  entityIdParamsSchema,
  saveEntitySchema,
  setEntityMarkerSchema,
  updateEntitySchema,
  type EntityIdParams,
} from '@remindme/contracts/entities'
import { topicIdParamsSchema, type TopicIdParams } from '@remindme/contracts/topics'
import {
  listSearchQuerySchema,
  type ListSearchQuery,
} from '@remindme/contracts/common/pagination'

import { auth } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/require-permission.js'
import { validate } from '../../middleware/validate.js'
import * as entitiesService from './entities.service.js'

const router = Router({ mergeParams: true })

router.use(auth, requirePermission('content:manage_own'))

router.get(
  '/',
  validate({ params: topicIdParamsSchema, query: listSearchQuerySchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId } = req.params as TopicIdParams
      const query = req.query as unknown as ListSearchQuery
      const entities = await entitiesService.listEntities(
        req.user!,
        categoryId,
        topicId,
        query,
      )
      res.json(entities)
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/',
  validate({ params: topicIdParamsSchema, body: saveEntitySchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId } = req.params as TopicIdParams
      const entity = await entitiesService.createEntity(
        req.user!,
        categoryId,
        topicId,
        req.body,
      )
      res.status(201).json(entity)
    } catch (error) {
      next(error)
    }
  },
)

router.get(
  '/:entityId',
  validate({ params: entityIdParamsSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId, entityId } = req.params as EntityIdParams
      const entity = await entitiesService.getEntity(
        req.user!,
        categoryId,
        topicId,
        entityId,
      )
      res.json(entity)
    } catch (error) {
      next(error)
    }
  },
)

router.patch(
  '/:entityId',
  validate({ params: entityIdParamsSchema, body: updateEntitySchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId, entityId } = req.params as EntityIdParams
      const entity = await entitiesService.updateEntity(
        req.user!,
        categoryId,
        topicId,
        entityId,
        req.body,
      )
      res.json(entity)
    } catch (error) {
      next(error)
    }
  },
)

router.delete(
  '/:entityId',
  validate({ params: entityIdParamsSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId, entityId } = req.params as EntityIdParams
      await entitiesService.deleteEntity(
        req.user!,
        categoryId,
        topicId,
        entityId,
      )
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
)

router.patch(
  '/:entityId/revise',
  validate({ params: entityIdParamsSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId, entityId } = req.params as EntityIdParams
      const entity = await entitiesService.reviseEntity(
        req.user!,
        categoryId,
        topicId,
        entityId,
      )
      res.json(entity)
    } catch (error) {
      next(error)
    }
  },
)

router.patch(
  '/:entityId/skip',
  validate({ params: entityIdParamsSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId, entityId } = req.params as EntityIdParams
      const entity = await entitiesService.skipEntity(
        req.user!,
        categoryId,
        topicId,
        entityId,
      )
      res.json(entity)
    } catch (error) {
      next(error)
    }
  },
)

router.patch(
  '/:entityId/marker',
  validate({ params: entityIdParamsSchema, body: setEntityMarkerSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId, entityId } = req.params as EntityIdParams
      const entity = await entitiesService.setEntityMarker(
        req.user!,
        categoryId,
        topicId,
        entityId,
        req.body.marker,
      )
      res.json(entity)
    } catch (error) {
      next(error)
    }
  },
)

export const entitiesRoutes = router
