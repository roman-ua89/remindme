import { useState } from 'react'

import { AppHeader } from '@/components/layout/AppHeader'
import { PageContainer } from '@/components/layout/PageContainer'
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs'
import { AddCategoryPopover } from '@/features/categories/components/AddCategoryPopover'
import { CategoryList } from '@/features/categories/components/CategoryList'
import { EmptyCategoryPrompt } from '@/features/categories/components/EmptyCategoryPrompt'
import { DEMO_CATEGORIES } from '@/features/categories/demo-data'
import type { Category } from '@/features/categories/types'

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES)

  function handleAddCategory(name: string) {
    setCategories((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
        topicCount: 0,
      },
    ])
  }

  function handleRenameCategory(id: string) {
    const category = categories.find((item) => item.id === id)
    if (!category) return

    const nextName = window.prompt('Rename category', category.name)?.trim()
    if (!nextName) return

    setCategories((current) =>
      current.map((item) =>
        item.id === id ? { ...item, name: nextName } : item,
      ),
    )
  }

  function handleDeleteCategory(id: string) {
    setCategories((current) => current.filter((item) => item.id !== id))
  }

  const hasCategories = categories.length > 0

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <PageContainer className="py-8">
        {hasCategories ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  Categories
                </h1>
                <AppBreadcrumbs />
              </div>
              <AddCategoryPopover onSave={handleAddCategory} />
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
            <EmptyCategoryPrompt onAddCategory={handleAddCategory} />
          </div>
        )}
      </PageContainer>
    </div>
  )
}
