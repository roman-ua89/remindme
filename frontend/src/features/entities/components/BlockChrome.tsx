import type { ReactNode } from 'react';
import { GripVerticalIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BLOCK_TYPE_VISUALS } from '@/features/entities/block-type-visuals';
import type { BlockType } from '@/features/entities/types';

type BlockChromeProps = {
    blockType: BlockType;
    dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
    onRemove: () => void;
    children: ReactNode;
    className?: string;
};

export function BlockChrome({ blockType, dragHandleProps, onRemove, children, className }: BlockChromeProps) {
    const { label, icon: Icon, tileClassName } = BLOCK_TYPE_VISUALS[blockType];

    return (
        <div className={cn('rounded-xl border border-border bg-card', className)}>
            <div className='flex items-center justify-between gap-2 border-b border-border px-3 py-2'>
                <div className='flex min-w-0 items-center gap-2'>
                    <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-sm', tileClassName)}>
                        <Icon className='size-4' />
                    </span>
                    <span className='truncate text-sm font-semibold'>{label}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <Button
                        type='button'
                        variant='ghost'
                        size='icon-sm'
                        aria-label='Reorder block'
                        className='cursor-grab active:cursor-grabbing'
                        {...dragHandleProps}
                    >
                        <GripVerticalIcon />
                    </Button>
                    <Button type='button' variant='ghost' size='icon-sm' aria-label='Remove block' onClick={onRemove}>
                        <XIcon />
                    </Button>
                </div>
            </div>
            <div className='p-3'>{children}</div>
        </div>
    );
}
