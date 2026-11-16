import type { Category } from '@/features/categories/types';
import { CategoryCard } from '@/features/categories/components/CategoryCard';

type CategoryListProps = {
    categories: Category[];
    onDelete: (id: string) => void;
};

export function CategoryList({ categories, onDelete }: CategoryListProps) {
    return (
        <div className='flex flex-col gap-3'>
            {categories.map((category) => (
                <CategoryCard key={category.id} category={category} onDelete={onDelete} />
            ))}
        </div>
    );
}
