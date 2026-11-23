import type { ReactNode } from 'react';

import { BlockPreviewRouter } from '@/features/entities/components/BlockPreviewRouter';
import { EntityMarkerToggle } from '@/features/entities/components/EntityMarkerToggle';
import type { EntityBlockForm, EntityMarker } from '@/features/entities/types';
import { cn } from '@/lib/utils';

type EntityReadOnlyContentProps = {
    title: string;
    blocks: EntityBlockForm[];
    marker?: EntityMarker | null;
    /** When provided, the marker toggle is rendered under the title. */
    onMarkerChange?: (marker: EntityMarker | null) => Promise<unknown>;
    /** Optional content rendered above the title (e.g. a breadcrumb). */
    header?: ReactNode;
    /** Optional classes merged into the title heading. */
    titleClassName?: string;
};

export const EntityReadOnlyContent = ({ title, blocks, marker = null, onMarkerChange, header, titleClassName }: EntityReadOnlyContentProps) => {
    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3'>
                {header}
                <h2 className={cn('font-heading text-2xl font-semibold tracking-tight', titleClassName)}>{title}</h2>
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
};
