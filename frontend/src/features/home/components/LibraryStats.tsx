import { useLibraryStats } from '@/features/stats/queries/use-library-stats';

export const LibraryStats = () => {
    const { data } = useLibraryStats();

    // `undefined` while loading or on error — rendered as an em dash.
    const stats = [
        { label: 'Categories', value: data?.categoriesCount },
        { label: 'Topics', value: data?.topicsCount },
        { label: 'Entities', value: data?.entitiesCount },
    ];

    return (
        <section aria-labelledby='library-stats-title' className='flex flex-col gap-3'>
            <h2 id='library-stats-title' className='text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase'>
                Your library
            </h2>
            <dl className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                {stats.map((stat) => (
                    <div key={stat.label} className='flex flex-col gap-2 rounded-xl border border-border bg-card p-6'>
                        <dt className='text-sm font-medium text-muted-foreground'>{stat.label}</dt>
                        <dd className='m-0 text-5xl leading-none font-semibold tracking-tight tabular-nums'>{stat.value ?? '—'}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
};
