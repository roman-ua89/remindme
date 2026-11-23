import { Layers2, Plus } from 'lucide-react';

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

export function EntityTemplatesPanel({
    blockCount,
    onHoverTemplate,
    onInsertTemplate,
    entityId,
    blocks,
    togglePreviewMode,
    visibility,
    onVisibilityChange,
}: EntityTemplatesPanelProps) {
    const isAtLimit = blockCount >= MAX_ENTITY_BLOCKS;

    return (
        <div className='flex flex-col gap-4 flex-grow-0 shrink-0 basis-2xs sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-x-hidden overflow-y-auto'>
            {entityId && visibility ? (
                <>
                    <div className='flex items-center justify-between gap-2'>
                        <span className='text-sm font-medium'>Shown in the Player</span>
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

            <div className='flex flex-col gap-1'>
                <h2 className='text-sm font-semibold'>Add a block</h2>
                <p className='text-sm text-muted-foreground'>Click a block to add it at the end.</p>
            </div>

            <div className='flex flex-col gap-2'>
                {templateTypes.map((type) => {
                    const { label, icon: Icon, tileClassName } = BLOCK_TYPE_VISUALS[type];
                    // Image keeps its plain template button; the other types get the coloured icon tile.
                    const hasTile = type !== 'image';

                    return (
                        <Button
                            key={type}
                            type='button'
                            variant='outline'
                            className={cn(
                                'group relative w-full justify-start',
                                hasTile && 'h-auto gap-3 rounded-2xl px-3 py-2.5 hover:border-input hover:shadow-tile-hover',
                            )}
                            disabled={isAtLimit}
                            onMouseEnter={() => onHoverTemplate(type)}
                            onMouseLeave={() => onHoverTemplate(null)}
                            onFocus={() => onHoverTemplate(type)}
                            onBlur={() => onHoverTemplate(null)}
                            onClick={() => onInsertTemplate(type)}
                        >
                            {hasTile ? (
                                <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-sm', tileClassName)}>
                                    <Icon className='size-4' />
                                </span>
                            ) : (
                                <Icon />
                            )}
                            {label}
                            <Plus className='absolute right-[10px] opacity-0 transition-opacity group-hover:opacity-100' />
                        </Button>
                    );
                })}
            </div>

            {isAtLimit ? <p className='text-sm text-muted-foreground'>Maximum {MAX_ENTITY_BLOCKS} blocks reached</p> : null}

            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between gap-2 text-sm'>
                    <span className='font-medium'>Blocks</span>
                    <span className='tabular-nums text-muted-foreground'>
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
                <Button variant='secondary' onClick={togglePreviewMode}>
                    <Layers2 /> Preview
                </Button>
            )}
        </div>
    );
}
