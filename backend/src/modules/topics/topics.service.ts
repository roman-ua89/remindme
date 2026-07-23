import type { AuthUser } from '../../middleware/auth.js'
import type {
  CreateTopicInput,
  Topic,
  UpdateTopicInput,
} from '@remindme/contracts/topics'

import { getCategoryForUser } from '../../lib/ownership.js'
import { conflict } from '../../lib/errors.js'
import { prisma } from '../../lib/prisma.js'

function toTopicDto(
  topic: { id: string; name: string; categoryId: string },
  entityCount: number,
): Topic {
  return {
    id: topic.id,
    name: topic.name,
    categoryId: topic.categoryId,
    entityCount,
  }
}

export async function listTopics(
  user: AuthUser,
  categoryId: string,
): Promise<Topic[]> {
  await getCategoryForUser(categoryId, user)

  const topics = await prisma.topic.findMany({
    where: { categoryId },
    orderBy: { position: 'asc' },
    include: {
      _count: { select: { entities: true } },
    },
  })

  return topics.map((topic) => toTopicDto(topic, topic._count.entities))
}

export async function getTopic(
  user: AuthUser,
  categoryId: string,
  topicId: string,
): Promise<Topic> {
  const { getTopicForUser } = await import('../../lib/ownership.js')
  const topic = await getTopicForUser(categoryId, topicId, user)

  const entityCount = await prisma.entity.count({
    where: { topicId: topic.id },
  })

  return toTopicDto(topic, entityCount)
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

  return toTopicDto(topic, 0)
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

  return toTopicDto(topic, topic._count.entities)
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
