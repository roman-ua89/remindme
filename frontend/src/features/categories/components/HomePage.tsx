import { AppHeader } from '@/components/layout/AppHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs'
import { AddCategoryPopover } from '@/features/categories/components/AddCategoryPopover'
import { CategoryList } from '@/features/categories/components/CategoryList'
import { EmptyCategoryPrompt } from '@/features/categories/components/EmptyCategoryPrompt'
import { useCategories } from '@/features/categories/queries/use-categories'
import { useDeleteCategory } from '@/features/categories/queries/use-delete-category'

export function HomePage() {
  const { data: categories = [], isLoading } = useCategories()
  const { mutate: deleteCategory } = useDeleteCategory()

  function handleDeleteCategory(id: string) {
    deleteCategory(id)
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
