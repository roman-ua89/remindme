import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs';
import { ListPagination } from '@/components/shared/ListPagination';
import { ListSearchInput } from '@/components/shared/ListSearchInput';
import { useCategory } from '@/features/categories/queries/use-category';
import { AddEntityButton } from '@/features/entities/components/AddEntityButton';
import { EmptyEntityPrompt } from '@/features/entities/components/EmptyEntityPrompt';
import { EntityList } from '@/features/entities/components/EntityList';
import { useDeleteEntity } from '@/features/entities/queries/use-delete-entity';
import { useEntities } from '@/features/entities/queries/use-entities';
import { useTopic } from '@/features/topics/queries/use-topic';
import { useListSearch } from '@/lib/use-list-search';
import { Button } from '#/components/ui/button.tsx';
import { ChevronLeft } from 'lucide-react';

export const EntitiesPage = () => {
    const navigate = useNavigate({
        from: '/categories/$categoryId/topics/$topicId/',
    });
    const { categoryId, topicId } = useParams({
        from: '/_app/categories/$categoryId/topics/$topicId/',
    });
    const { page: pageParam } = useSearch({
        from: '/_app/categories/$categoryId/topics/$topicId/',
    });
    const page = pageParam ?? 1;

    const resetPage = useCallback(() => {
        void navigate({
            search: (prev) => ({ ...prev, page: undefined }),
            replace: true,
        });
    }, [navigate]);

    const { inputValue, searchQuery, isSearchActive, handleInputChange, clearSearch } = useListSearch({
        onSearchChange: resetPage,
    });

    const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } = useCategory(categoryId);
    const { data: topic, isLoading: isTopicLoading, isError: isTopicError } = useTopic(categoryId, topicId);
    const { data, isLoading: isEntitiesLoading, isPending } = useEntities(categoryId, topicId, page, undefined, searchQuery);
    const { mutate: deleteEntity } = useDeleteEntity(categoryId, topicId);

    const topicHasEntitiesRef = useRef(0);

    useEffect(() => {
        if (!searchQuery && data !== undefined) {
            topicHasEntitiesRef.current = data.totalItems;
        }
    }, [data, searchQuery]);

    const entities = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;
    const isPageLoading = isCategoryLoading || isTopicLoading;
    const isEntitiesInitialLoad = isEntitiesLoading;
    const showFullPageLoader = isPageLoading || isEntitiesInitialLoad;

    const topicEntityCount = isSearchActive ? topicHasEntitiesRef.current : (data?.totalItems ?? 0);
    const showEntitiesView = topicEntityCount > 0 || isSearchActive;

    const isSearchResultsFound = isSearchActive && !isPending && (data?.totalItems ?? 0) > 0;

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

    function handleEditEntity(id: string) {
        void navigate({
            to: '/categories/$categoryId/topics/$topicId/entities/$entityId',
            params: { categoryId, topicId, entityId: id },
        });
    }

    function handleRemoveEntity(id: string) {
        deleteEntity({ entityId: id });
    }

    function handlePageChange(nextPage: number) {
        void navigate({
            search: (prev) => ({
                ...prev,
                page: nextPage === 1 ? undefined : nextPage,
            }),
        });
    }

    function handleCleanSearch() {
        clearSearch();
        resetPage();
    }

    const goBack = () => {
        navigate({ to: '/categories/$categoryId', params: { categoryId } });
    };

    return (
        <div className='min-h-screen'>
            <AppHeader />

            <PageContainer className='py-8'>
                {showFullPageLoader ? (
                    <div className='flex flex-col items-center gap-1 py-12 text-muted-foreground'>Loading entities…</div>
                ) : isCategoryError || isTopicError || !category || !topic ? (
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            <AppBreadcrumbs category={category ? { id: categoryId, name: category.name } : undefined} />
                            <h1 className='font-heading text-2xl font-medium tracking-tight'>Topic not found</h1>
                        </div>
                        <p className='text-muted-foreground'>Topic not found.</p>
                    </div>
                ) : showEntitiesView ? (
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-center justify-between gap-4'>
                            <div className='flex flex-col gap-2'>
                                <AppBreadcrumbs category={{ id: categoryId, name: category.name }} topic={{ id: topicId, name: topic.name }} />
                                <h1 className='font-heading text-2xl font-medium tracking-tight'>Entities</h1>
                            </div>
                            <div className='flex gap-2'>
                                <Button variant='outline' onClick={goBack}>
                                    <ChevronLeft />
                                    Back to Topics
                                </Button>
                                <AddEntityButton categoryId={categoryId} topicId={topicId} />
                            </div>
                        </div>

                        <ListSearchInput
                            value={inputValue}
                            onChange={handleInputChange}
                            isPending={isSearchActive && isPending}
                            showClean={isSearchResultsFound}
                            onClean={handleCleanSearch}
                        />

                        <EntityList entities={entities} onEdit={handleEditEntity} onRemove={handleRemoveEntity} />

                        <ListPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                ) : (
                    <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-2'>
                            <AppBreadcrumbs category={{ id: categoryId, name: category.name }} topic={{ id: topicId, name: topic.name }} />
                            <h1 className='font-heading text-2xl font-medium tracking-tight'>{topic.name}</h1>
                        </div>
                        <EmptyEntityPrompt categoryId={categoryId} topicId={topicId} />
                    </div>
                )}
            </PageContainer>
        </div>
    );
};
