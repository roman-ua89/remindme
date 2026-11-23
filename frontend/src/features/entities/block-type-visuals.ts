import { Code2, FileText, Image, Link2, List } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { BlockType } from '@/features/entities/types';

export type BlockTypeVisual = {
    label: string;
    icon: LucideIcon;
    /** Icon tile: soft background plus strong foreground (block-type tokens in index.css). */
    tileClassName: string;
};

export const BLOCK_TYPE_VISUALS: Record<BlockType, BlockTypeVisual> = {
    text: { label: 'Text', icon: FileText, tileClassName: 'bg-block-text-soft text-block-text' },
    code: { label: 'Code', icon: Code2, tileClassName: 'bg-block-code-soft text-block-code' },
    image: { label: 'Image', icon: Image, tileClassName: 'bg-muted text-muted-foreground' },
    list: { label: 'List', icon: List, tileClassName: 'bg-block-list-soft text-block-list' },
    link: { label: 'Link', icon: Link2, tileClassName: 'bg-block-link-soft text-block-link' },
};
