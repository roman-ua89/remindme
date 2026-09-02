import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

type PlayerBatchCompleteDialogProps = {
    open: boolean
    isLoading?: boolean
    onNextBatch: () => void
    onHome: () => void
}

export function PlayerBatchCompleteDialog({
    open,
    isLoading = false,
    onNextBatch,
    onHome,
}: PlayerBatchCompleteDialogProps) {
    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Batch complete</DialogTitle>
                    <DialogDescription>
                        You finished this pack. Get the next 3 entities or return Home.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onHome} disabled={isLoading}>
                        Go to Home
                    </Button>
                    <Button type="button" onClick={onNextBatch} disabled={isLoading}>
                        Get next 3
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
