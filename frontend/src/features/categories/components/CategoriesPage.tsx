import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs';
import { ListPagination } from '@/components/shared/ListPagination';
import { AddCategoryPopover } from '@/features/categories/components/AddCategoryPopover';
import { CategoryList } from '@/features/categories/components/CategoryList';
import { EmptyCategoryPrompt } from '@/features/categories/components/EmptyCategoryPrompt';
import { useCategories } from '@/features/categories/queries/use-categories';
import { useDeleteCategory } from '@/features/categories/queries/use-delete-category';

export const CategoriesPage = () => {
    const navigate = useNavigate({ from: '/categories/' });
    const { page: pageParam } = useSearch({ from: '/_app/categories/' });
    const page = pageParam ?? 1;
    const { data, isLoading } = useCategories(page);
    const { mutate: deleteCategory } = useDeleteCategory();

    const categories = data?.items ?? [];
    const totalItems = data?.totalItems ?? 0;
    const totalPages = data?.totalPages ?? 0;

    useEffect(() => {
        if (!data) {
            return;
        }
        if (data.totalPages >= 1 && page > data.totalPages) {
            void navigate({
                search: (prev) => ({ ...prev, page: data.totalPages }),
                replace: true,
            });
        }
    }, [data, navigate, page]);

    function handleDeleteCategory(id: string) {
        deleteCategory(id);
    }

    function handlePageChange(nextPage: number) {
        void navigate({
            search: (prev) => ({
                ...prev,
                page: nextPage === 1 ? undefined : nextPage,
            }),
        });
    }

    const hasCategories = totalItems > 0;

    return (
        <div className='min-h-screen bg-background'>
            <AppHeader />

            <PageContainer className='py-8'>
                {isLoading ? (
                    <div className='flex flex-col items-center gap-1 py-12 text-muted-foreground'>Loading categories…</div>
                ) : hasCategories ? (
                    <div className='flex flex-col gap-6'>
                        <div className='flex items-start justify-between gap-4'>
                            <div className='flex flex-col gap-1'>
                                <h1 className='font-heading text-2xl font-semibold tracking-tight'>Categories</h1>
                                <AppBreadcrumbs />
                            </div>
                            <AddCategoryPopover />
                        </div>

                        <CategoryList categories={categories} onDelete={handleDeleteCategory} />

                        <ListPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-6'>
                        <div className='flex flex-col items-center gap-1'>
                            <h1 className='font-heading text-2xl font-semibold tracking-tight'>Categories</h1>
                            <AppBreadcrumbs />
                        </div>
                        <EmptyCategoryPrompt />
                    </div>
                )}
            </PageContainer>
        </div>
    );
};
