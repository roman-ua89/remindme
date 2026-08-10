import { Router } from 'express'

import {
  createTopicSchema,
  topicIdParamsSchema,
  updateTopicSchema,
  type TopicIdParams,
} from '@remindme/contracts/topics'
import {
  categoryIdParamsSchema,
  type CategoryIdParams,
} from '@remindme/contracts/categories'
import {
  paginationQuerySchema,
  type PaginationQuery,
} from '@remindme/contracts/common/pagination'

import { auth } from '../../middleware/auth.js'
import { requirePermission } from '../../middleware/require-permission.js'
import { validate } from '../../middleware/validate.js'
import * as topicsService from './topics.service.js'

const router = Router({ mergeParams: true })

router.use(auth, requirePermission('content:manage_own'))

router.get(
  '/',
  validate({ params: categoryIdParamsSchema, query: paginationQuerySchema }),
  async (req, res, next) => {
    try {
      const { categoryId } = req.params as CategoryIdParams
      const pagination = req.query as unknown as PaginationQuery
      const topics = await topicsService.listTopics(
        req.user!,
        categoryId,
        pagination,
      )
      res.json(topics)
    } catch (error) {
      next(error)
    }
  },
)

router.post(
  '/',
  validate({ params: categoryIdParamsSchema, body: createTopicSchema }),
  async (req, res, next) => {
    try {
      const { categoryId } = req.params as CategoryIdParams
      const topic = await topicsService.createTopic(req.user!, categoryId, req.body)
      res.status(201).json(topic)
    } catch (error) {
      next(error)
    }
  },
)

router.get(
  '/:topicId',
  validate({ params: topicIdParamsSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId } = req.params as TopicIdParams
      const topic = await topicsService.getTopic(req.user!, categoryId, topicId)
      res.json(topic)
    } catch (error) {
      next(error)
    }
  },
)

router.patch(
  '/:topicId',
  validate({ params: topicIdParamsSchema, body: updateTopicSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId } = req.params as TopicIdParams
      const topic = await topicsService.updateTopic(
        req.user!,
        categoryId,
        topicId,
        req.body,
      )
      res.json(topic)
    } catch (error) {
      next(error)
    }
  },
)

router.delete(
  '/:topicId',
  validate({ params: topicIdParamsSchema }),
  async (req, res, next) => {
    try {
      const { categoryId, topicId } = req.params as TopicIdParams
      await topicsService.deleteTopic(req.user!, categoryId, topicId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
)

export const topicsRoutes = router
