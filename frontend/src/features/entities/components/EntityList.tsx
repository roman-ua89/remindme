import { EntityCard } from '@/features/entities/components/EntityCard';
import type { EntityListItem } from '@/features/entities/types';

type EntityListProps = {
    entities: EntityListItem[];
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
};

export function EntityList({ entities, onEdit, onRemove }: EntityListProps) {
    return (
        <div className='flex flex-col gap-3'>
            {entities.map((entity) => (
                <EntityCard key={entity.id} entity={entity} onEdit={onEdit} onRemove={onRemove} />
            ))}
        </div>
    );
}
