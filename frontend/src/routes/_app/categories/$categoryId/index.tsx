import { createFileRoute } from '@tanstack/react-router'

import { TopicsPage } from '@/features/topics/components/TopicsPage'

export const Route = createFileRoute('/_app/categories/$categoryId/')({
  component: TopicsPage,
})
