import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/features/categories/components/HomePage'
import { listPageSearchSchema } from '@/lib/list-page-search'

export const Route = createFileRoute('/_app/')({
  validateSearch: listPageSearchSchema,
  component: HomePage,
})
