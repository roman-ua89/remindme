import { TopicCard } from '@/features/topics/components/TopicCard'
import type { Topic } from '@/features/topics/types'

type TopicListProps = {
  topics: Topic[]
  onRename: (id: string) => void
  onDelete: (id: string) => void
}

export function TopicList({ topics, onRename, onDelete }: TopicListProps) {
  return (
    <div className="flex flex-col gap-3">
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
