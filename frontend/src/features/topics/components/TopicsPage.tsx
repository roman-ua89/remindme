import { useEffect } from 'react';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs';
import { ListPagination } from '@/components/shared/ListPagination';
import { useCategory } from '@/features/categories/queries/use-category';
import { AddTopicPopover } from '@/features/topics/components/AddTopicPopover';
import { EmptyTopicPrompt } from '@/features/topics/components/EmptyTopicPrompt';
import { TopicList } from '@/features/topics/components/TopicList';
import { useDeleteTopic } from '@/features/topics/queries/use-delete-topic';
import { useTopics } from '@/features/topics/queries/use-topics';
import { Button } from '#/components/ui/button.tsx';
import { ChevronLeft } from 'lucide-react';

export const TopicsPage = () => {
    const navigate = useNavigate({ from: '/categories/$categoryId/' });
    const { categoryId } = useParams({ from: '/_app/categories/$categoryId/' });
    const { page: pageParam } = useSearch({
        from: '/_app/categories/$categoryId/',
    });
    const page = pageParam ?? 1;
    const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } = useCategory(categoryId);
    const { data, isLoading: isTopicsLoading } = useTopics(categoryId, page);
    const { mutate: deleteTopic } = useDeleteTopic(categoryId);

    const topics = data?.items ?? [];
    const totalItems = data?.totalItems ?? 0;
    const totalPages = data?.totalPages ?? 0;
    const isLoading = isCategoryLoading || isTopicsLoading;

    useEffect(() => {
        if (!data) {
            return;
        }
        if (data.totalPages >= 1 && page > data.totalPages) {
            void navigate({
                search: (prev) => ({
                    ...prev,
                    page: data.totalPages === 1 ? undefined : data.totalPages,
                }),
                replace: true,
            });
        }
    }, [data, navigate, page]);

    function handleDeleteTopic(id: string) {
        deleteTopic({ topicId: id });
    }

    function handlePageChange(nextPage: number) {
        void navigate({
            search: (prev) => ({
                ...prev,
                page: nextPage === 1 ? undefined : nextPage,
            }),
        });
    }

    const goBack = () => {
        navigate({ to: '/categories' });
    };

    if (isLoading) {
        return (
            <div className='min-h-screen'>
                <AppHeader />
                <PageContainer className='flex flex-col gap-4 py-8'>
                    <p className='text-muted-foreground'>Loading topics…</p>
                </PageContainer>
            </div>
        );
    }

    if (isCategoryError || !category) {
        return (
            <div className='min-h-screen'>
                <AppHeader />
                <PageContainer className='flex flex-col gap-4 py-8'>
                    <div className='flex flex-col gap-2'>
                        <AppBreadcrumbs />
                        <h1 className='font-heading text-2xl font-medium tracking-tight'>Category not found</h1>
                    </div>
                    <p className='text-muted-foreground'>Category not found.</p>
                </PageContainer>
            </div>
        );
    }

    const hasTopics = totalItems > 0;

    return (
        <div className='min-h-screen'>
            <AppHeader />

            <PageContainer className='py-8'>
                <div className='flex flex-col gap-6'>
                    {hasTopics ? (
                        <>
                            <div className='flex items-center justify-between gap-4'>
                                <div className='flex flex-col gap-2'>
                                    <AppBreadcrumbs category={{ id: categoryId, name: category.name }} />
                                    <h1 className='font-heading text-2xl font-medium tracking-tight'>Topics</h1>
                                </div>
                                <div className='flex gap-2'>
                                    <Button variant='outline' onClick={goBack}>
                                        <ChevronLeft />
                                        Back to Categories
                                    </Button>
                                    <AddTopicPopover categoryId={categoryId} />
                                </div>
                            </div>

                            <TopicList topics={topics} onDelete={handleDeleteTopic} />

                            <ListPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        </>
                    ) : (
                        <>
                            <div className='flex flex-col gap-2'>
                                <AppBreadcrumbs category={{ id: categoryId, name: category.name }} />
                                <h1 className='font-heading text-2xl font-medium tracking-tight'>{category.name}</h1>
                            </div>
                            <EmptyTopicPrompt categoryId={categoryId} />
                        </>
                    )}
                </div>
            </PageContainer>
        </div>
    );
};
