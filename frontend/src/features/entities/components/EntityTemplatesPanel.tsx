import { Eye, Plus } from 'lucide-react';
import { useId } from 'react';

import { VisibilitySwitch } from '@/components/shared/VisibilitySwitch';
import { Button } from '@/components/ui/button';
import { BLOCK_TYPE_VISUALS } from '@/features/entities/block-type-visuals';
import type { BlockType, EntityBlockForm, EntityVisibility } from '@/features/entities/types';
import { MAX_ENTITY_BLOCKS } from '@/features/entities/types';
import { cn } from '@/lib/utils';

const templateTypes: BlockType[] = ['text', 'code', 'image', 'list', 'link'];

type EntityTemplatesPanelProps = {
    blocks: EntityBlockForm[];
    entityId?: string;
    blockCount: number;
    onHoverTemplate: (type: BlockType | null) => void;
    onInsertTemplate: (type: BlockType) => void;
    togglePreviewMode: () => void;
    /** Shown only in edit mode (when entityId is set) */
    visibility?: EntityVisibility;
    onVisibilityChange: (visibility: EntityVisibility) => Promise<unknown>;
};

export const EntityTemplatesPanel = ({
    blockCount,
    onHoverTemplate,
    onInsertTemplate,
    entityId,
    blocks,
    togglePreviewMode,
    visibility,
    onVisibilityChange,
}: EntityTemplatesPanelProps) => {
    const headingId = useId();
    const isAtLimit = blockCount >= MAX_ENTITY_BLOCKS;

    return (
        <aside
            aria-labelledby={headingId}
            className='flex flex-col gap-4 flex-grow-0 shrink-0 basis-[300px] sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-x-hidden overflow-y-auto p-[18px] border border-border rounded-[20px] bg-card'
        >
            {entityId && visibility ? (
                <>
                    <div className='flex items-center justify-between gap-2'>
                        <span className='text-sm font-semibold'>Shown in the Player</span>
                        <VisibilitySwitch
                            included={visibility === 'included'}
                            onChange={(included) => onVisibilityChange(included ? 'included' : 'excluded')}
                            ariaLabel='Entity visibility'
                            onTooltip='Shown in the Player'
                            offTooltip='Hidden from the Player'
                        />
                    </div>
                    <div className='h-px bg-border' />
                </>
            ) : null}

            <div className='flex flex-col gap-0.5'>
                <h2 id={headingId} className='font-heading text-xl font-medium'>
                    Add a block
                </h2>
                <p className='text-[13px] text-muted-foreground'>Hover to preview, click to add.</p>
            </div>

            <div className='flex flex-col gap-2'>
                {templateTypes.map((type) => {
                    const { label, description, icon: Icon, tileClassName } = BLOCK_TYPE_VISUALS[type];

                    return (
                        <Button
                            key={type}
                            type='button'
                            variant='outline'
                            className='group relative h-auto w-full justify-start gap-3 rounded-[14px] px-3 py-2.5 text-left hover:border-insert-placeholder-border hover:bg-white hover:shadow-tile-hover focus-visible:border-insert-placeholder-border focus-visible:bg-white focus-visible:shadow-tile-hover'
                            disabled={isAtLimit}
                            onMouseEnter={() => onHoverTemplate(type)}
                            onMouseLeave={() => onHoverTemplate(null)}
                            onFocus={() => onHoverTemplate(type)}
                            onBlur={() => onHoverTemplate(null)}
                            onClick={() => onInsertTemplate(type)}
                        >
                            <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-[10px]', tileClassName)}>
                                <Icon className='size-[18px]' />
                            </span>
                            <span className='flex flex-1 flex-col'>
                                <span className='text-[15px] font-semibold text-foreground'>{label}</span>
                                <span className='text-[13px] font-normal text-muted-foreground'>{description}</span>
                            </span>
                            <Plus className='absolute right-3 size-[18px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100' />
                        </Button>
                    );
                })}
            </div>

            {isAtLimit ? <p className='text-sm text-muted-foreground'>Maximum {MAX_ENTITY_BLOCKS} blocks reached</p> : null}

            <div className='h-px bg-border' />

            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between gap-2 text-sm'>
                    <span className='text-muted-foreground'>Blocks</span>
                    <span className='font-semibold tabular-nums text-foreground'>
                        {blocks.length} / {MAX_ENTITY_BLOCKS}
                    </span>
                </div>
                <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
                    <div
                        className='h-full rounded-full bg-linear-to-r from-blocks-meter-from to-blocks-meter-to'
                        style={{ width: `${(blocks.length / MAX_ENTITY_BLOCKS) * 100}%` }}
                    />
                </div>
            </div>

            {entityId && (
                <Button variant='secondary' className='w-full gap-2 text-[15px]' onClick={togglePreviewMode}>
                    <Eye className='size-[17px]' /> Preview
                </Button>
            )}
        </aside>
    );
};
