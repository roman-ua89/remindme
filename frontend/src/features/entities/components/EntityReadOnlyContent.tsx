import { BlockPreviewRouter } from '@/features/entities/components/BlockPreviewRouter';
import { EntityMarkerToggle } from '@/features/entities/components/EntityMarkerToggle';
import type { EntityBlockForm, EntityMarker } from '@/features/entities/types';

type EntityReadOnlyContentProps = {
    title: string;
    blocks: EntityBlockForm[];
    marker?: EntityMarker | null;
    /** When provided, the marker toggle is rendered under the title. */
    onMarkerChange?: (marker: EntityMarker | null) => Promise<unknown>;
};

export function EntityReadOnlyContent({ title, blocks, marker = null, onMarkerChange }: EntityReadOnlyContentProps) {
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3'>
                <h2 className='font-heading text-2xl font-semibold tracking-tight'>{title}</h2>
                {onMarkerChange ? <EntityMarkerToggle value={marker} onChange={onMarkerChange} /> : null}
            </div>

            {blocks.length > 0 ? (
                <div className='flex flex-col gap-4'>
                    {blocks.map((block) => (
                        <BlockPreviewRouter key={block.clientId} block={block} />
                    ))}
                </div>
            ) : null}
        </div>
    );
}
