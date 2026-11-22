import { useMemo } from 'react';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Spinner } from '@/components/ui/spinner';
import { ActivityMonthNav } from '@/features/activity/components/ActivityMonthNav';
import { useActivityMonth } from '@/features/activity/hooks/use-activity-month';
import { dayAxisTicks } from '@/features/activity/utils/axis-ticks';

const chartConfig = {
    revised: { label: 'Revised', color: 'var(--chart-revised)' },
    skipped: { label: 'Skipped', color: 'var(--chart-skipped)' },
} satisfies ChartConfig;

const tickStyle = { fill: 'var(--muted-foreground)', fontSize: 10 };

type ChartRow = { date: string; day: number; revised: number; skipped: number };

export const DailyActivityChart = () => {
    const { month, rows: monthRows, query, canGoPrev, canGoNext, goPrev, goNext } = useActivityMonth();
    const { isPending, isError } = query;
    const hasData = !isPending && !isError;

    const rows = useMemo<Array<ChartRow>>(
        () => monthRows.map(({ date, day, revisedCount, skippedCount }) => ({ date, day, revised: revisedCount, skipped: skippedCount })),
        [monthRows],
    );

    const xTicks = useMemo(() => dayAxisTicks(rows.map((row) => row.day)), [rows]);

    const totals = useMemo(
        () =>
            monthRows.reduce((sum, row) => ({ revised: sum.revised + row.revisedCount, skipped: sum.skipped + row.skippedCount }), {
                revised: 0,
                skipped: 0,
            }),
        [monthRows],
    );

    return (
        <section aria-labelledby='daily-activity-title' className='flex flex-col gap-2.5 rounded-xl border border-border bg-card px-5 py-4.5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <h2 id='daily-activity-title' className='text-[13px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                    Daily activity
                </h2>
                <ActivityMonthNav month={month} canGoPrev={canGoPrev} canGoNext={canGoNext} onPrev={goPrev} onNext={goNext} />
            </div>

            <div className='flex flex-wrap items-baseline gap-2'>
                <span className='font-heading text-[28px] leading-none font-medium tabular-nums'>{hasData ? totals.revised : '—'}</span>
                <span className='text-sm text-muted-foreground'>revised · {hasData ? totals.skipped : '—'} skipped</span>
            </div>

            {isPending ? (
                <div className='flex h-[220px] items-center justify-center'>
                    <Spinner />
                </div>
            ) : isError ? (
                <div className='flex h-[220px] items-center justify-center text-sm text-muted-foreground'>Could not load activity.</div>
            ) : (
                <ChartContainer config={chartConfig} className='aspect-auto h-[220px] w-full'>
                    <BarChart accessibilityLayer data={rows} margin={{ left: -20, right: 12 }}>
                        <CartesianGrid vertical={false} stroke='var(--chart-grid)' />
                        <XAxis
                            dataKey='day'
                            axisLine={{ stroke: 'var(--chart-axis)' }}
                            tickLine={false}
                            tickMargin={8}
                            ticks={xTicks}
                            interval={0}
                            tick={tickStyle}
                        />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={48} tick={tickStyle} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(_label, payload) => {
                                        const date = (payload[0]?.payload as ChartRow | undefined)?.date;
                                        return date ? format(new Date(`${date}T00:00:00`), 'EEE, d MMM') : null;
                                    }}
                                />
                            }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        {/* Stack order: first bar is the bottom segment. */}
                        <Bar dataKey='skipped' stackId='activity' fill='var(--color-skipped)' barSize={6} radius={[2, 2, 2, 2]} />
                        <Bar dataKey='revised' stackId='activity' fill='var(--color-revised)' barSize={6} radius={[2, 2, 2, 2]} />
                    </BarChart>
                </ChartContainer>
            )}
        </section>
    );
};
