import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { BlockType } from '@/features/entities/types';

type BlockPreviewChromeProps = {
    blockType: BlockType;
    children: ReactNode;
    className?: string;
};

// Deliberately bare: the block previews draw their own surfaces, so the wrapper must not add a second card.
// Image is the exception: its preview has no surface of its own, so it keeps the framed card.
export const BlockPreviewChrome = ({ blockType, children, className }: BlockPreviewChromeProps) => {
    if (blockType === 'image') {
        return (
            <div className={cn('rounded-lg border border-border bg-card', className)}>
                <div className='p-3'>{children}</div>
            </div>
        );
    }

    return <div className={cn('min-w-0', className)}>{children}</div>;
};
