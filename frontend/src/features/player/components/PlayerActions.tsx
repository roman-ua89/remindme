import { Button } from '@/components/ui/button'

type PlayerActionsProps = {
    disabled?: boolean
    onDone: () => void
    onSkip: () => void
}

export function PlayerActions({ disabled = false, onDone, onSkip }: PlayerActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={onDone} disabled={disabled}>
                Done
            </Button>
            <Button type="button" variant="outline" onClick={onSkip} disabled={disabled}>
                Skip
            </Button>
        </div>
    )
}
