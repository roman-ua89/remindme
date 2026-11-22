import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Round 40px icon buttons inside a ListRow. Three levels: the default colour, the colour while the row is hovered
 * (`group/list-row`), and the button's own hover colour, which must win over the row-hover one.
 */
export const listRowActionClassName = {
    play: 'bg-action-play group-hover/list-row:bg-action-play-row-hover hover:bg-action-play-hover',
    edit: 'bg-action-edit group-hover/list-row:bg-action-edit-row-hover hover:bg-action-edit-hover',
    remove: 'bg-action-remove group-hover/list-row:bg-action-remove-row-hover hover:bg-action-remove-hover',
} as const;

type ListRowProps = {
    /** Title, normally a router `Link`; the row styles the link */
    title: ReactNode;
    meta?: ReactNode;
    /** Excluded from the Player: dashed border, paper background, muted title */
    hidden?: boolean;
    /** Markers, counts and the visibility switch, left of the actions */
    details?: ReactNode;
    /** Icon buttons styled with `listRowActionClassName` */
    actions?: ReactNode;
};

export const ListRow = ({ title, meta, hidden = false, details, actions }: ListRowProps) => {
    return (
        <div
            className={cn(
                'group/list-row flex items-center gap-4 rounded-lg border border-border bg-card px-5 py-4',
                hidden && 'border-dashed bg-background',
            )}
        >
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <div className={cn('truncate text-base font-semibold [&_a:hover]:text-primary-hover', hidden && 'text-muted-foreground')}>
                    {title}
                </div>
                {meta ? <div className='text-[13px] text-muted-foreground'>{meta}</div> : null}
            </div>
            {details ? <div className='flex shrink-0 items-center gap-3'>{details}</div> : null}
            {actions ? <div className='flex shrink-0 items-center gap-2'>{actions}</div> : null}
        </div>
    );
};
