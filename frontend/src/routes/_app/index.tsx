import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/features/categories/components/HomePage'

export const Route = createFileRoute('/_app/')({
  component: HomePage,
})
