import { EntityReadOnlyContent } from '@/features/entities/components/EntityReadOnlyContent';
import type { EntityMarker } from '@/features/entities/types';
import { toEntityFormValues } from '@/features/entities/utils/to-form-values';
import { PlayerEntityBreadcrumb } from '@/features/player/components/PlayerEntityBreadcrumb';
import type { PlayerBatchItem } from '@/features/player/types';

type PlayerPreviewProps = {
    entity: PlayerBatchItem;
    onMarkerChange: (marker: EntityMarker | null) => Promise<unknown>;
};

export const PlayerPreview = ({ entity, onMarkerChange }: PlayerPreviewProps) => {
    const { title, blocks } = toEntityFormValues(entity);

    return (
        <div className='mx-auto w-full max-w-[808px] rounded-2xl border border-border bg-card p-6 shadow-tile-hover'>
            <div className='mx-auto max-w-[760px]'>
                <EntityReadOnlyContent
                    header={<PlayerEntityBreadcrumb categoryName={entity.categoryName} topicName={entity.topicName} />}
                    title={title}
                    titleClassName='text-[40px] leading-tight font-medium'
                    blocks={blocks}
                    marker={entity.marker}
                    onMarkerChange={onMarkerChange}
                />
            </div>
        </div>
    );
};
