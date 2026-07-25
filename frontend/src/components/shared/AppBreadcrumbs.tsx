import { Link } from '@tanstack/react-router';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

type AppBreadcrumbsProps = {
    category?: {
        id: string;
        name: string;
    };
    topic?: {
        id: string;
        name: string;
    };
    entity?: {
        id: string;
        name: string;
    };
};

export function AppBreadcrumbs({ category, topic, entity }: AppBreadcrumbsProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    {category ? <BreadcrumbLink render={<Link to='/' />}>Home</BreadcrumbLink> : <BreadcrumbPage>Home</BreadcrumbPage>}
                </BreadcrumbItem>

                {category ? (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {topic ? (
                                <BreadcrumbLink render={<Link to='/categories/$categoryId' params={{ categoryId: category.id }} />}>
                                    Category: {category.name}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>Category: {category.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </>
                ) : null}

                {topic && category ? (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {entity ? (
                                <BreadcrumbLink
                                    render={
                                        <Link to='/categories/$categoryId/topics/$topicId' params={{ categoryId: category.id, topicId: topic.id }} />
                                    }
                                >
                                    Topic: {topic.name}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>Topic: {topic.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </>
                ) : null}

                {category && topic && entity ? (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>
                            <span className='font-medium'>Entity: {entity.name}</span>
                        </BreadcrumbPage>
                    </>
                ) : null}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
