import { useMemo } from 'react';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Spinner } from '@/components/ui/spinner';
import { ActivityMonthNav } from '@/features/activity/components/ActivityMonthNav';
import { useActivityMonth } from '@/features/activity/hooks/use-activity-month';
import { dayAxisTicks } from '@/features/activity/utils/axis-ticks';
import { PLAYER_DAILY_GOAL_MINUTES } from '@/features/player/constants';

const chartConfig = {
    minutes: { label: 'Time in Player', color: 'var(--chart-player-time)' },
} satisfies ChartConfig;

const tickStyle = { fill: 'var(--muted-foreground)', fontSize: 10 };

type ChartRow = { date: string; day: number; minutes: number; seconds: number };

function formatMinutes(seconds: number): string {
    if (seconds > 0 && seconds < 60) {
        return '< 1 min';
    }
    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
}

export const PlayerTimeChart = () => {
    const { month, rows: monthRows, query, canGoPrev, canGoNext, goPrev, goNext } = useActivityMonth();
    const { isPending, isError } = query;
    const hasData = !isPending && !isError;

    const rows = useMemo<Array<ChartRow>>(
        () =>
            monthRows.map(({ date, day, playerSeconds }) => ({
                date,
                day,
                minutes: Math.round((playerSeconds / 60) * 10) / 10,
                seconds: playerSeconds,
            })),
        [monthRows],
    );

    const summary = useMemo(() => {
        const totalSeconds = monthRows.reduce((sum, row) => sum + row.playerSeconds, 0);
        const activeDays = monthRows.filter((row) => row.playerSeconds > 0).length;
        return { totalSeconds, activeDays, averageSeconds: activeDays > 0 ? totalSeconds / activeDays : 0 };
    }, [monthRows]);

    const xTicks = useMemo(() => dayAxisTicks(rows.map((row) => row.day)), [rows]);

    // The line runs through every day of the month; the dot marks the last day with time (-1 when there is none).
    const lastActiveIndex = useMemo(() => rows.map((row) => row.seconds > 0).lastIndexOf(true), [rows]);

    const renderLastDot = ({ cx, cy, index }: { cx?: number; cy?: number; index?: number }) =>
        index === lastActiveIndex && cx !== undefined && cy !== undefined ? (
            <circle key={index} cx={cx} cy={cy} r={4} fill='var(--color-minutes)' stroke='var(--card)' strokeWidth={2} />
        ) : null;

    return (
        <section aria-labelledby='player-time-title' className='flex flex-col gap-2.5 rounded-xl border border-border bg-card px-5 py-4.5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <h2 id='player-time-title' className='text-[13px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
                    Time in Player
                </h2>
                <ActivityMonthNav month={month} canGoPrev={canGoPrev} canGoNext={canGoNext} onPrev={goPrev} onNext={goNext} />
            </div>

            <div className='flex flex-wrap items-baseline gap-2'>
                <span className='font-heading text-[28px] leading-none font-medium tabular-nums'>
                    {hasData ? formatMinutes(summary.totalSeconds) : '—'}
                </span>
                {hasData && summary.activeDays > 0 ? (
                    <span className='text-sm text-muted-foreground'>average {formatMinutes(summary.averageSeconds)} per active day</span>
                ) : null}
            </div>

            {isPending ? (
                <div className='flex h-[220px] items-center justify-center'>
                    <Spinner />
                </div>
            ) : isError ? (
                <div className='flex h-[220px] items-center justify-center text-sm text-muted-foreground'>Could not load activity.</div>
            ) : (
                <ChartContainer config={chartConfig} className='aspect-auto h-[220px] w-full'>
                    <AreaChart accessibilityLayer data={rows} margin={{ left: -8, right: 12, top: 8 }}>
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
                        {/* Keep the goal line in view on light days. */}
                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={48}
                            unit='m'
                            tick={tickStyle}
                            domain={[0, (dataMax: number) => Math.max(Math.ceil(dataMax), PLAYER_DAILY_GOAL_MINUTES)]}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(_label, payload) => {
                                        const date = (payload[0]?.payload as ChartRow | undefined)?.date;
                                        return date ? format(new Date(`${date}T00:00:00`), 'EEE, d MMM') : null;
                                    }}
                                    formatter={(_value, _name, item) => (
                                        <div className='flex w-full items-center justify-between gap-4'>
                                            <span className='text-muted-foreground'>{chartConfig.minutes.label}</span>
                                            <span className='font-mono font-medium text-foreground tabular-nums'>
                                                {formatMinutes((item.payload as ChartRow).seconds)}
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <ReferenceLine
                            y={PLAYER_DAILY_GOAL_MINUTES}
                            stroke='var(--muted-foreground)'
                            strokeDasharray='4 4'
                            label={{
                                value: `Goal ${PLAYER_DAILY_GOAL_MINUTES} min`,
                                position: 'insideTopRight',
                                fontSize: 11,
                                fill: 'var(--muted-foreground)',
                            }}
                        />
                        <Area
                            dataKey='minutes'
                            type='linear'
                            fill='var(--color-minutes)'
                            fillOpacity={0.14}
                            stroke='var(--color-minutes)'
                            strokeWidth={2}
                            dot={renderLastDot}
                        />
                    </AreaChart>
                </ChartContainer>
            )}
        </section>
    );
};
