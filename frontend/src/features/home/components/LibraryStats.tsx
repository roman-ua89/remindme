import { useLibraryStats } from '@/features/stats/queries/use-library-stats';
import { cn } from '@/lib/utils';

export const LibraryStats = () => {
    const { data } = useLibraryStats();

    // `undefined` while loading or on error — rendered as an em dash.
    const stats = [
        { label: 'categories', value: data?.categoriesCount },
        { label: 'topics', value: data?.topicsCount },
        { label: 'entities', value: data?.entitiesCount },
    ];

    // The label comes first in the DOM (dt before dd, as HTML requires); `flex-row-reverse` shows the number first.
    // `flex-wrap` keeps a long count from pushing the row past its column.
    return (
        <dl aria-label='Your library' className='m-0 flex flex-wrap gap-y-2 border-t border-chart-grid pt-3'>
            {stats.map((stat, index) => (
                <div
                    key={stat.label}
                    className={cn(
                        'flex flex-row-reverse items-baseline justify-end gap-1.5 px-5 first:pl-0 last:pr-0',
                        index > 0 && 'border-l border-border',
                    )}
                >
                    <dt className='text-sm text-muted-foreground'>{stat.label}</dt>
                    <dd className='m-0 font-heading text-[26px] leading-none tabular-nums'>{stat.value ?? '—'}</dd>
                </div>
            ))}
        </dl>
    );
};
