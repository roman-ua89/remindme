import { useQueryClient } from '@tanstack/react-query'

import { AppHeader } from '@/components/layout/AppHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs'
import { AddCategoryPopover } from '@/features/categories/components/AddCategoryPopover'
import { CategoryList } from '@/features/categories/components/CategoryList'
import { EmptyCategoryPrompt } from '@/features/categories/components/EmptyCategoryPrompt'
import { useCategories } from '@/features/categories/queries/use-categories'
import type { Category } from '@/features/categories/types'
import { queryKeys } from '@/lib/query-keys'

export function HomePage() {
  const queryClient = useQueryClient()
  const { data: categories = [], isLoading } = useCategories()

  function handleRenameCategory(id: string) {
    const category = categories.find((item) => item.id === id)
    if (!category) return

    const nextName = window.prompt('Rename category', category.name)?.trim()
    if (!nextName) return

    queryClient.setQueryData<Category[]>(queryKeys.categories.all, (current = []) =>
      current.map((item) =>
        item.id === id ? { ...item, name: nextName } : item,
      ),
    )
  }

  function handleDeleteCategory(id: string) {
    queryClient.setQueryData<Category[]>(queryKeys.categories.all, (current = []) =>
      current.filter((item) => item.id !== id),
    )
  }

  const hasCategories = categories.length > 0

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <PageContainer className="py-8">
        {isLoading ? (
          <div className="flex flex-col items-center gap-1 py-12 text-muted-foreground">
            Loading categories…
          </div>
        ) : hasCategories ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  Categories
                </h1>
                <AppBreadcrumbs />
              </div>
              <AddCategoryPopover />
            </div>

            <CategoryList
              categories={categories}
              onRename={handleRenameCategory}
              onDelete={handleDeleteCategory}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Categories
              </h1>
              <AppBreadcrumbs />
            </div>
            <EmptyCategoryPrompt />
          </div>
        )}
      </PageContainer>
    </div>
  )
}
