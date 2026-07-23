import type { EntityListItem } from '@remindme/contracts/entities'

import { DEMO_CATEGORIES } from '@/features/categories/demo-data'
import type { Category } from '@/features/categories/types'
import { DEMO_TOPICS } from '@/features/topics/demo-data'
import type { Topic } from '@/features/topics/types'

export const DEMO_ENTITIES: EntityListItem[] = [
  { id: 'e1', topicId: 't1', title: 'Present Simple — usage', revisedCount: 3, skippedCount: 0, visibility: 'included', position: 0 },
  { id: 'e2', topicId: 't1', title: 'Irregular verbs list', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 1 },
  { id: 'e3', topicId: 't1', title: 'Phrasal verbs — common patterns', revisedCount: 1, skippedCount: 0, visibility: 'included', position: 2 },
  { id: 'e4', topicId: 't1', title: 'Past Simple vs Present Perfect', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 3 },
  { id: 'e5', topicId: 't1', title: 'Modal verbs overview', revisedCount: 5, skippedCount: 0, visibility: 'included', position: 4 },
  { id: 'e6', topicId: 't2', title: 'Break the ice', revisedCount: 2, skippedCount: 0, visibility: 'included', position: 0 },
  { id: 'e7', topicId: 't2', title: 'Hit the nail on the head', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 1 },
  { id: 'e8', topicId: 't2', title: 'Once in a blue moon', revisedCount: 1, skippedCount: 0, visibility: 'included', position: 2 },
  { id: 'e9', topicId: 't3', title: 'Articles — a, an, the', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 0 },
  { id: 'e10', topicId: 't3', title: 'Countable vs uncountable nouns', revisedCount: 4, skippedCount: 0, visibility: 'included', position: 1 },
  { id: 'e11', topicId: 't4', title: 'Generic constraints', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 0 },
  { id: 'e12', topicId: 't4', title: 'extends vs implements', revisedCount: 2, skippedCount: 0, visibility: 'included', position: 1 },
  { id: 'e13', topicId: 't4', title: 'keyof and indexed access types', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 2 },
  { id: 'e14', topicId: 't4', title: 'Conditional types basics', revisedCount: 1, skippedCount: 0, visibility: 'included', position: 3 },
  { id: 'e15', topicId: 't5', title: 'Partial and Required', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 0 },
  { id: 'e16', topicId: 't5', title: 'Pick and Omit', revisedCount: 3, skippedCount: 0, visibility: 'included', position: 1 },
  { id: 'e17', topicId: 't6', title: 'useState patterns', revisedCount: 6, skippedCount: 0, visibility: 'included', position: 0 },
  { id: 'e18', topicId: 't6', title: 'useEffect cleanup', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 1 },
  { id: 'e19', topicId: 't6', title: 'useMemo vs useCallback', revisedCount: 2, skippedCount: 0, visibility: 'included', position: 2 },
  { id: 'e20', topicId: 't6', title: 'Custom hooks structure', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 3 },
  { id: 'e21', topicId: 't6', title: 'useRef for DOM access', revisedCount: 1, skippedCount: 0, visibility: 'included', position: 4 },
  { id: 'e22', topicId: 't6', title: 'Context + useReducer', revisedCount: 0, skippedCount: 0, visibility: 'included', position: 5 },
]

export function getCategoryById(categoryId: string): Category | undefined {
  return DEMO_CATEGORIES.find((category) => category.id === categoryId)
}

export function getTopicById(topicId: string): Topic | undefined {
  return DEMO_TOPICS.find((topic) => topic.id === topicId)
}

export function getEntitiesByTopicId(topicId: string): EntityListItem[] {
  return DEMO_ENTITIES.filter((entity) => entity.topicId === topicId)
}

export function getEntityById(entityId: string): EntityListItem | undefined {
  return DEMO_ENTITIES.find((entity) => entity.id === entityId)
}
