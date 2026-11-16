import { createFileRoute } from '@tanstack/react-router';

import { TopicsPage } from '@/features/topics/components/TopicsPage';
import { listPageSearchSchema } from '@/lib/list-page-search';

export const Route = createFileRoute('/_app/categories/$categoryId/')({
    validateSearch: listPageSearchSchema,
    component: TopicsPage,
});
