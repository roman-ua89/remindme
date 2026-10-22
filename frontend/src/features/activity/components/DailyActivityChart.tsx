import { useMemo, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, format, isAfter, isSameMonth, parseISO, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Button } from '@/components/ui/button';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Spinner } from '@/components/ui/spinner';
import { useDailyActivity } from '@/features/activity/queries/use-daily-activity';

const chartConfig = {
    revised: { label: 'Revised', color: 'var(--chart-revised)' },
    skipped: { label: 'Skipped', color: 'var(--chart-skipped)' },
} satisfies ChartConfig;

type ChartRow = { date: string; day: number; revised: number; skipped: number };

export const DailyActivityChart = () => {
    const [month, setMonth] = useState(() => startOfMonth(new Date()));
    const monthKey = format(month, 'yyyy-MM');
    const isCurrentMonth = isSameMonth(month, new Date());
    const { data, isPending, isError, isPlaceholderData } = useDailyActivity(monthKey);
    // Paging stops at the first month with any activity (empty months in between stay reachable).
    const earliestMonth = data?.firstActivityDate ? startOfMonth(parseISO(data.firstActivityDate)) : startOfMonth(new Date());
    const isEarliestMonth = !isAfter(month, earliestMonth);

    // API returns only days with activity; zero-fill the rest so every day gets a slot.
    const rows = useMemo<Array<ChartRow>>(() => {
        const byDate = new Map((data?.month === monthKey ? data.days : []).map((day) => [day.date, day]));
        return eachDayOfInterval({ start: month, end: endOfMonth(month) }).map((date) => {
            const key = format(date, 'yyyy-MM-dd');
            const day = byDate.get(key);
            return { date: key, day: date.getDate(), revised: day?.revisedCount ?? 0, skipped: day?.skippedCount ?? 0 };
        });
    }, [data, month, monthKey]);

    return (
        <section aria-labelledby='daily-activity-title' className='flex flex-col gap-3'>
            <h2 id='daily-activity-title' className='text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase'>
                Daily activity
            </h2>
            <div className='flex flex-col gap-4 rounded-xl border border-border bg-card p-6'>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        size='sm'
                        disabled={isEarliestMonth || isPlaceholderData}
                        onClick={() => setMonth((current) => addMonths(current, -1))}
                    >
                        <ChevronLeft />
                        Prev month
                    </Button>
                    <Button variant='outline' size='sm' disabled={isCurrentMonth} onClick={() => setMonth((current) => addMonths(current, 1))}>
                        Next
                        <ChevronRight />
                    </Button>
                    <span className='ml-2 text-sm font-medium'>{format(month, 'LLLL yyyy')}</span>
                </div>

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
