import { cn } from '@/lib/utils';

type SproutLogoProps = {
    className?: string;
};

/** RemindMe wordmark with the sprout mark. A span, not a link: wrap it in a link where it should navigate. */
export const SproutLogo = ({ className }: SproutLogoProps) => (
    <span className={cn('inline-flex items-center gap-2 font-heading text-[22px] font-semibold tracking-[-0.01em]', className)}>
        <svg width={26} height={26} viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M6.5 21.2 H17.5' fill='none' strokeWidth={1.8} strokeLinecap='round' className='stroke-tree-pebble' />
            <path d='M12 21 C12 17.5 11.8 15 12 12.2' fill='none' strokeWidth={2.2} strokeLinecap='round' className='stroke-logo-stem' />
            <path
                d='M12 13.2 C9.6 8.6 5.2 8.8 4 10.8 C5.6 13.9 9.6 14.8 12 13.2 Z'
                strokeWidth={1.3}
                strokeLinejoin='round'
                className='fill-tree-leaf stroke-tree-outline'
            />
            <path
                d='M12 12.4 C14.2 7 19 6.6 20.3 8.8 C18.9 12.2 14.6 13.6 12 12.4 Z'
                strokeWidth={1.3}
                strokeLinejoin='round'
                className='fill-tree-leaf stroke-tree-outline'
            />
        </svg>
        RemindMe
    </span>
);
