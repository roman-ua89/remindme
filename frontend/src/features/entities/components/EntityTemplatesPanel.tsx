import { Code2, FileText, Image, Layers2, List, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { BlockType, EntityBlockForm } from '@/features/entities/types';
import { MAX_ENTITY_BLOCKS } from '@/features/entities/types';
import { cn } from '@/lib/utils';

const templates: Array<{
    type: BlockType;
    label: string;
    icon: typeof FileText;
}> = [
    { type: 'text', label: 'Text', icon: FileText },
    { type: 'code', label: 'Code', icon: Code2 },
    { type: 'image', label: 'Image', icon: Image },
    { type: 'list', label: 'List', icon: List },
];

type EntityTemplatesPanelProps = {
    blocks: EntityBlockForm[];
    entityId?: string;
    blockCount: number;
    onHoverTemplate: (type: BlockType | null) => void;
    onInsertTemplate: (type: BlockType) => void;
    togglePreviewMode: () => void;
};

export function EntityTemplatesPanel({
    blockCount,
    onHoverTemplate,
    onInsertTemplate,
    entityId,
    blocks,
    togglePreviewMode,
}: EntityTemplatesPanelProps) {
    const isAtLimit = blockCount >= MAX_ENTITY_BLOCKS;

    return (
        <div className='flex flex-col gap-3 flex-grow-0 shrink-0 basis-2xs sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto'>
            <h2 className='text-sm font-medium'>Templates</h2>
            <div className='flex flex-col gap-2'>
                {templates.map(({ type, label, icon: Icon }) => (
                    <Button
                        key={type}
                        type='button'
                        variant='outline'
                        className={cn('w-full justify-start group relative')}
                        disabled={isAtLimit}
                        onMouseEnter={() => onHoverTemplate(type)}
                        onMouseLeave={() => onHoverTemplate(null)}
                        onFocus={() => onHoverTemplate(type)}
                        onBlur={() => onHoverTemplate(null)}
                        onClick={() => onInsertTemplate(type)}
                    >
                        <Icon />
                        {label}
                        <Plus className='opacity-0 group-hover:opacity-100 absolute right-[10px]' />
                    </Button>
                ))}
            </div>
            {isAtLimit ? <p className='text-sm text-muted-foreground'>Maximum {MAX_ENTITY_BLOCKS} blocks reached</p> : null}
            {entityId && (
                <Button variant='softBlue' onClick={togglePreviewMode}>
                    <Layers2 /> Preview
                </Button>
            )}

            <p className='text-sm text-muted-foreground'>
                Blocks ({blocks.length}/{MAX_ENTITY_BLOCKS})
            </p>
        </div>
    );
}
