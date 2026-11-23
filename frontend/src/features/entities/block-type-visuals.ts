import { Code2, FileText, Image, Link2, List } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { BlockType } from '@/features/entities/types';

export type BlockTypeVisual = {
    label: string;
    /** One-line hint shown under the label in the Constructor template list. */
    description: string;
    icon: LucideIcon;
    /** Icon tile: soft background plus strong foreground (block-type tokens in index.css). */
    tileClassName: string;
};

export const BLOCK_TYPE_VISUALS: Record<BlockType, BlockTypeVisual> = {
    text: { label: 'Text', description: 'Formatted notes', icon: FileText, tileClassName: 'bg-block-text-soft text-block-text' },
    code: { label: 'Code', description: 'Snippet with highlighting', icon: Code2, tileClassName: 'bg-block-code-soft text-block-code' },
    image: { label: 'Image', description: 'Picture from your device', icon: Image, tileClassName: 'bg-block-image-soft text-block-image' },
    list: { label: 'List', description: 'Pairs in two columns', icon: List, tileClassName: 'bg-block-list-soft text-block-list' },
    link: { label: 'Link', description: 'Title and URL', icon: Link2, tileClassName: 'bg-block-link-soft text-block-link' },
};
