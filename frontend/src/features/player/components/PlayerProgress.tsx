import type { PlayerBatchProgress } from '@/features/player/types';
import { cn } from '@/lib/utils';

type PlayerProgressProps = {
    progress: PlayerBatchProgress;
};

type SegmentState = 'done' | 'current' | 'upcoming';

const SEGMENT_CLASS: Record<SegmentState, string> = {
    done: 'bg-primary',
    current: 'bg-player-progress-current',
    upcoming: 'bg-chart-grid',
};

function getSegmentState(index: number, completedInBatch: number): SegmentState {
    if (index < completedInBatch) {
        return 'done';
    }
    return index === completedInBatch ? 'current' : 'upcoming';
}

/** One segment per entity in the pack: done, the one on screen now, then upcoming. */
export const PlayerProgress = ({ progress }: PlayerProgressProps) => {
    const { completedInBatch, batchTotal, remainingInBatch } = progress;

    return (
        <div className='flex w-full flex-col gap-3'>
            <div className='flex items-baseline justify-between gap-3'>
                <p className='text-sm font-semibold tabular-nums text-foreground'>
                    {completedInBatch} of {batchTotal}
                </p>
                <p className='text-sm text-muted-foreground tabular-nums'>{remainingInBatch} left in this pack</p>
            </div>
            <div
                role='progressbar'
                aria-label='Pack progress'
                aria-valuemin={0}
                aria-valuemax={batchTotal}
                aria-valuenow={completedInBatch}
                className='flex w-full gap-1.5'
            >
                {Array.from({ length: batchTotal }, (_, index) => (
                    <div key={index} className={cn('h-2 flex-1 rounded-full', SEGMENT_CLASS[getSegmentState(index, completedInBatch)])} />
                ))}
            </div>
        </div>
    );
};
