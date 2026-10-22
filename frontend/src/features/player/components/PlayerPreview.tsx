import { EntityReadOnlyContent } from '@/features/entities/components/EntityReadOnlyContent';
import type { EntityMarker } from '@/features/entities/types';
import { toEntityFormValues } from '@/features/entities/utils/to-form-values';
import type { PlayerBatchItem } from '@/features/player/types';

type PlayerPreviewProps = {
    entity: PlayerBatchItem;
    onMarkerChange: (marker: EntityMarker | null) => Promise<unknown>;
};

export function PlayerPreview({ entity, onMarkerChange }: PlayerPreviewProps) {
    const { title, blocks } = toEntityFormValues(entity);

    return (
        <div className='rounded-lg border border-border bg-card p-6'>
            <EntityReadOnlyContent title={title} blocks={blocks} marker={entity.marker} onMarkerChange={onMarkerChange} />
        </div>
    );
}
