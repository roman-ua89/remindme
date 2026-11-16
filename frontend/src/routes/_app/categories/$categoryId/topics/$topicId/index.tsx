import { createFileRoute } from '@tanstack/react-router';

import { EntitiesPage } from '@/features/entities/components/EntitiesPage';
import { listPageSearchSchema } from '@/lib/list-page-search';

export const Route = createFileRoute('/_app/categories/$categoryId/topics/$topicId/')({
    validateSearch: listPageSearchSchema,
    component: EntitiesPage,
});
