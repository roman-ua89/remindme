import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { BlockType } from '@/features/entities/types';

type BlockPreviewChromeProps = {
    blockType: BlockType;
    children: ReactNode;
    className?: string;
};

export function BlockPreviewChrome({ children, className }: BlockPreviewChromeProps) {
    return (
        <div className={cn('rounded-lg border border-border bg-card', className)}>
            <div className='p-3'>{children}</div>
        </div>
    );
}
