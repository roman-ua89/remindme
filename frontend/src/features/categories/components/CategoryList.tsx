import type { Category } from '@/features/categories/types'
import { CategoryCard } from '@/features/categories/components/CategoryCard'

type CategoryListProps = {
  categories: Category[]
  onRename: (id: string) => void
  onDelete: (id: string) => void
}

export function CategoryList({
  categories,
  onRename,
  onDelete,
}: CategoryListProps) {
  return (
    <div className="flex flex-col gap-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
