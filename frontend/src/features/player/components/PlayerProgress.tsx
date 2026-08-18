import { Progress, ProgressLabel } from '@/components/ui/progress'
import type { PlayerBatchProgress } from '@/features/player/types'

type PlayerProgressProps = {
    progress: PlayerBatchProgress
}

export function PlayerProgress({ progress }: PlayerProgressProps) {
    const { completedInBatch, batchTotal, remainingInBatch, value } = progress

    return (
        <Progress value={value} className="w-full">
            <div className="flex w-full items-baseline justify-between gap-3">
                <ProgressLabel>
                    {completedInBatch} of {batchTotal}
                </ProgressLabel>
                <p className="text-sm text-muted-foreground tabular-nums">{remainingInBatch} left</p>
            </div>
        </Progress>
    )
}
