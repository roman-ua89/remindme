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

/**
 * Raises the controls inside `details` and `actions` above the title link's `::after`, which is stretched over the row. Plain text and
 * gaps stay below it, so clicks there reach the link. Covers buttons (the visibility Switch included), tooltip triggers and marker dots.
 */
const rowControlClassName =
    '[&_button]:relative [&_button]:z-10 [&_[data-slot=tooltip-trigger]]:relative [&_[data-slot=tooltip-trigger]]:z-10 [&_[role=img]]:relative [&_[role=img]]:z-10';

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
                'group/list-row relative flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-card py-3 pr-3 pl-5 transition-[border-color,background-color,box-shadow] duration-150 hover:shadow-list-row-hover has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50',
                hidden ? 'border-dashed bg-background' : 'hover:border-list-row-hover-border hover:bg-list-row-hover-bg',
            )}
        >
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <div
                    className={cn(
                        'truncate text-base font-semibold transition-colors duration-150 group-hover/list-row:text-primary [&_a]:after:absolute [&_a]:after:inset-0 [&_a]:after:content-[""] [&_a]:after:rounded-lg [&_a:focus-visible]:outline-none',
                        hidden && 'text-muted-foreground group-hover/list-row:text-primary-hover',
                    )}
                >
                    {title}
                </div>
                {meta ? <div className='text-[13px] text-muted-foreground'>{meta}</div> : null}
            </div>
            {details ? <div className={cn('flex shrink-0 items-center gap-3', rowControlClassName)}>{details}</div> : null}
            {actions ? <div className={cn('flex shrink-0 items-center gap-1', rowControlClassName)}>{actions}</div> : null}
        </div>
    );
};
