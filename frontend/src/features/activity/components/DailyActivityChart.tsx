import { useMemo } from 'react';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Spinner } from '@/components/ui/spinner';
import { ActivityMonthNav } from '@/features/activity/components/ActivityMonthNav';
import { useActivityMonth } from '@/features/activity/hooks/use-activity-month';

const chartConfig = {
    revised: { label: 'Revised', color: 'var(--chart-revised)' },
    skipped: { label: 'Skipped', color: 'var(--chart-skipped)' },
} satisfies ChartConfig;

type ChartRow = { date: string; day: number; revised: number; skipped: number };

export const DailyActivityChart = () => {
    const { month, rows: monthRows, query, canGoPrev, canGoNext, goPrev, goNext } = useActivityMonth();
    const { isPending, isError } = query;

    const rows = useMemo<Array<ChartRow>>(
        () => monthRows.map(({ date, day, revisedCount, skippedCount }) => ({ date, day, revised: revisedCount, skipped: skippedCount })),
        [monthRows],
    );

    return (
        <section aria-labelledby='daily-activity-title' className='flex flex-col gap-3'>
            <h2 id='daily-activity-title' className='text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase'>
                Daily activity
            </h2>
            <div className='flex flex-col gap-4 rounded-xl border border-border bg-card p-6'>
                <ActivityMonthNav month={month} canGoPrev={canGoPrev} canGoNext={canGoNext} onPrev={goPrev} onNext={goNext} />

                {isPending ? (
                    <div className='flex h-[260px] items-center justify-center'>
                        <Spinner />
                    </div>
                ) : isError ? (
                    <div className='flex h-[260px] items-center justify-center text-sm text-muted-foreground'>Could not load activity.</div>
                ) : (
                    <ChartContainer config={chartConfig} className='aspect-auto h-[260px] w-full'>
                        <BarChart accessibilityLayer data={rows} margin={{ left: -20, right: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey='day' tickLine={false} axisLine={false} tickMargin={8} interval={0} fontSize={11} />
                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={48} />
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
                            <Bar dataKey='skipped' stackId='activity' fill='var(--color-skipped)' radius={[0, 0, 4, 4]} />
                            <Bar dataKey='revised' stackId='activity' fill='var(--color-revised)' radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </section>
    );
};
