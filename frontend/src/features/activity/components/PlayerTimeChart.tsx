import { useMemo } from 'react';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Spinner } from '@/components/ui/spinner';
import { ActivityMonthNav } from '@/features/activity/components/ActivityMonthNav';
import { useActivityMonth } from '@/features/activity/hooks/use-activity-month';
import { PLAYER_DAILY_GOAL_MINUTES } from '@/features/player/constants';

const chartConfig = {
    minutes: { label: 'Time in Player', color: 'var(--chart-player-time)' },
} satisfies ChartConfig;

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

    return (
        <section aria-labelledby='player-time-title' className='flex flex-col gap-3'>
            <h2 id='player-time-title' className='text-[13px] font-semibold tracking-[0.08em] text-muted-foreground uppercase'>
                Time in Player
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
                        <AreaChart accessibilityLayer data={rows} margin={{ left: -8, right: 0, top: 8 }}>
                            <defs>
                                <linearGradient id='fill-player-time' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='var(--color-minutes)' stopOpacity={0.6} />
                                    <stop offset='95%' stopColor='var(--color-minutes)' stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey='day' tickLine={false} axisLine={false} tickMargin={8} interval={0} fontSize={11} />
                            {/* Keep the goal line in view on light days. */}
                            <YAxis
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                width={48}
                                unit='m'
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
                            <Area dataKey='minutes' type='monotone' fill='url(#fill-player-time)' stroke='var(--color-minutes)' strokeWidth={2} />
                        </AreaChart>
                    </ChartContainer>
                )}
            </div>
        </section>
    );
};
