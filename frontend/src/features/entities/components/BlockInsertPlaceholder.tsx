import { BLOCK_TYPE_VISUALS } from '@/features/entities/block-type-visuals';
import type { BlockType } from '@/features/entities/types';
import { cn } from '@/lib/utils';

/** Image keeps its own plain placeholder (EntityContentPanel), so it has no skeleton here. */
type BlockInsertPlaceholderType = Exclude<BlockType, 'image'>;

type BlockInsertPlaceholderProps = {
    blockType: BlockInsertPlaceholderType;
};

const TEXT_LINE_WIDTHS = ['w-full', 'w-11/12', 'w-2/3'];
const LIST_CELLS = [0, 1, 2, 3, 4, 5];

const TextSkeleton = () => (
    <div className='flex flex-col gap-2.5'>
        {TEXT_LINE_WIDTHS.map((width) => (
            <div key={width} className={cn('h-2.5 rounded-full bg-border', width)} />
        ))}
    </div>
);

const CodeSkeleton = () => (
    <div className='flex flex-col gap-2 rounded-lg border border-block-code-border bg-block-code-surface p-3'>
        <div className='h-2 w-2/5 rounded-full bg-block-code/60' />
        <div className='ml-4 h-2 w-3/5 rounded-full bg-block-list/60' />
        <div className='ml-4 h-2 w-1/3 rounded-full bg-block-link/60' />
        <div className='h-2 w-1/2 rounded-full bg-block-code/30' />
    </div>
);

const ListSkeleton = () => (
    <div className='grid grid-cols-2 gap-2'>
        {LIST_CELLS.map((cell) => (
            <div key={cell} className='h-7 rounded-md bg-block-list-soft' />
        ))}
    </div>
);

const LinkSkeleton = () => (
    <div className='flex items-center gap-3 rounded-lg border border-block-link-border bg-block-link-surface p-3'>
        <div className='size-9 shrink-0 rounded-sm bg-block-link-soft' />
        <div className='flex flex-1 flex-col gap-2'>
            <div className='h-2.5 w-1/2 rounded-full bg-border' />
            <div className='h-2 w-1/3 rounded-full bg-border' />
        </div>
    </div>
);

const renderSkeleton = (blockType: BlockInsertPlaceholderType) => {
    switch (blockType) {
        case 'text':
            return <TextSkeleton />;
        case 'code':
            return <CodeSkeleton />;
        case 'list':
            return <ListSkeleton />;
        case 'link':
            return <LinkSkeleton />;
    }
};

export const BlockInsertPlaceholder = ({ blockType }: BlockInsertPlaceholderProps) => {
    const { label, icon: Icon, tileClassName } = BLOCK_TYPE_VISUALS[blockType];

    return (
        <div className='flex flex-col gap-3 rounded-lg border-[1.5px] border-dashed border-insert-placeholder-border bg-insert-placeholder-surface p-4'>
            <div className='flex items-center gap-2.5'>
                <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-sm', tileClassName)}>
                    <Icon className='size-4' />
                </span>
                <p className='text-sm text-muted-foreground'>A {label.toLowerCase()} block will be added here</p>
            </div>
            <div aria-hidden>{renderSkeleton(blockType)}</div>
        </div>
    );
};
