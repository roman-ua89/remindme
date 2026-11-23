import { ArrowUpRight } from 'lucide-react';

import { BLOCK_TYPE_VISUALS } from '@/features/entities/block-type-visuals';
import type { LinkContentJson } from '@/features/entities/types';
import { cn } from '@/lib/utils';

type LinkBlockPreviewProps = {
    contentJson: LinkContentJson;
};

export const LinkBlockPreview = ({ contentJson }: LinkBlockPreviewProps) => {
    const title = contentJson.title.trim();
    const { icon: Icon, tileClassName } = BLOCK_TYPE_VISUALS.link;

    return (
        <a
            href={contentJson.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-4 rounded-xl border border-block-link-border bg-block-link-surface p-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
        >
            <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-[10px]', tileClassName)}>
                <Icon className='size-5' aria-hidden='true' />
            </span>

            <span className='flex min-w-0 flex-1 flex-col gap-0.5'>
                {title ? <span className='text-base font-semibold text-foreground'>{title}</span> : null}
                <span className='text-sm break-all text-block-link-url'>{contentJson.url}</span>
            </span>

            <ArrowUpRight className='size-5 shrink-0 text-block-link-url' aria-hidden='true' />
        </a>
    );
};
