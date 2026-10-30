import type { AuthUser } from '../../middleware/auth.js'
import type { PaginationQuery } from '@remindme/contracts/common/pagination'
import type { EntityMarker } from '@remindme/contracts/entities'
import type {
  CreateTopicInput,
  Topic,
  TopicListPage,
  UpdateTopicInput,
} from '@remindme/contracts/topics'

import { findTopicMarkers } from '../../lib/entity-markers.js'
import { conflict } from '../../lib/errors.js'
import { getCategoryForUser } from '../../lib/ownership.js'
import { getPaginationSkip, toPaginatedResponse } from '../../lib/pagination.js'
import { prisma } from '../../lib/prisma.js'

function toTopicDto(
  topic: { id: string; name: string; categoryId: string },
  entityCount: number,
  markers: EntityMarker[],
): Topic {
  return {
    id: topic.id,
    name: topic.name,
    categoryId: topic.categoryId,
    entityCount,
    markers,
  }
}

async function getMarkersByTopicIds(topicIds: string[]): Promise<Map<string, EntityMarker[]>> {
  const rows = await findTopicMarkers({ topicId: { in: topicIds } })

  const markersByTopic = new Map<string, EntityMarker[]>()
  for (const { topicId, marker } of rows) {
    const markers = markersByTopic.get(topicId) ?? []
    markers.push(marker)
    markersByTopic.set(topicId, markers)
  }

  return markersByTopic
}

async function getTopicMarkers(topicId: string): Promise<EntityMarker[]> {
  const markersByTopic = await getMarkersByTopicIds([topicId])
  return markersByTopic.get(topicId) ?? []
}

export async function listTopics(
  user: AuthUser,
  categoryId: string,
  pagination: PaginationQuery,
): Promise<TopicListPage> {
  await getCategoryForUser(categoryId, user)

  const where = { categoryId }
  const [totalItems, topics] = await Promise.all([
    prisma.topic.count({ where }),
    prisma.topic.findMany({
      where,
      orderBy: { position: 'desc' },
      skip: getPaginationSkip(pagination),
      take: pagination.pageSize,
      include: {
        _count: { select: { entities: true } },
      },
    }),
  ])

  const markersByTopic = await getMarkersByTopicIds(topics.map((topic) => topic.id))

  return toPaginatedResponse(
    topics.map((topic) => toTopicDto(topic, topic._count.entities, markersByTopic.get(topic.id) ?? [])),
    totalItems,
    pagination,
  )
}

export async function getTopic(
  user: AuthUser,
  categoryId: string,
  topicId: string,
): Promise<Topic> {
  const { getTopicForUser } = await import('../../lib/ownership.js')
  const topic = await getTopicForUser(categoryId, topicId, user)

  const [entityCount, markers] = await Promise.all([
    prisma.entity.count({
      where: { topicId: topic.id },
    }),
    getTopicMarkers(topic.id),
  ])

  return toTopicDto(topic, entityCount, markers)
}

export async function createTopic(
  user: AuthUser,
  categoryId: string,
  input: CreateTopicInput,
): Promise<Topic> {
  await getCategoryForUser(categoryId, user)

  const maxPosition = await prisma.topic.aggregate({
    where: { categoryId },
    _max: { position: true },
  })

  const position = (maxPosition._max.position ?? -1) + 1

  const topic = await prisma.topic.create({
    data: {
      categoryId,
      name: input.name,
      position,
    },
  })

  return toTopicDto(topic, 0, [])
}

export async function updateTopic(
  user: AuthUser,
  categoryId: string,
  topicId: string,
  input: UpdateTopicInput,
): Promise<Topic> {
  const { getTopicForUser } = await import('../../lib/ownership.js')
  await getTopicForUser(categoryId, topicId, user)

  const topic = await prisma.topic.update({
    where: { id: topicId },
    data: { name: input.name },
    include: {
      _count: { select: { entities: true } },
    },
  })

  return toTopicDto(topic, topic._count.entities, await getTopicMarkers(topic.id))
}

export async function deleteTopic(
  user: AuthUser,
  categoryId: string,
  topicId: string,
): Promise<void> {
  const { getTopicForUser } = await import('../../lib/ownership.js')
  await getTopicForUser(categoryId, topicId, user)

  const entityCount = await prisma.entity.count({
    where: { topicId },
  })

  if (entityCount > 0) {
    throw conflict('Cannot delete a topic that contains entities')
  }

  await prisma.topic.delete({ where: { id: topicId } })
}
