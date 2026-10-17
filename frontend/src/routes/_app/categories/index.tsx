import { createFileRoute } from '@tanstack/react-router';

import { CategoriesPage } from '@/features/categories/components/CategoriesPage';
import { listPageSearchSchema } from '@/lib/list-page-search';

export const Route = createFileRoute('/_app/categories/')({
    validateSearch: listPageSearchSchema,
    component: CategoriesPage,
});
