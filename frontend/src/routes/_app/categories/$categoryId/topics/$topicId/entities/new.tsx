import { createFileRoute } from '@tanstack/react-router';

import { EntityConstructorPage } from '@/features/entities/components/EntityConstructorPage';

export const Route = createFileRoute('/_app/categories/$categoryId/topics/$topicId/entities/new')({
    component: NewEntityRoute,
});

function NewEntityRoute() {
    const { categoryId, topicId } = Route.useParams();

    return <EntityConstructorPage categoryId={categoryId} topicId={topicId} />;
}
