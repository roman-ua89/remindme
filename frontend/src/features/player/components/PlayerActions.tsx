import { Button } from '@/components/ui/button';

type PlayerActionsProps = {
    disabled?: boolean;
    onDone: () => void;
    onSkip: () => void;
};

const KBD_CLASS =
    'mx-0.5 inline-block min-w-6 rounded-md border border-input bg-card px-1.5 py-px text-center font-sans text-xs font-semibold text-foreground';

export const PlayerActions = ({ disabled = false, onDone, onSkip }: PlayerActionsProps) => {
    return (
        <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-wrap items-center justify-center gap-3'>
                <Button type='button' variant='secondary' size='lg' className='min-w-[160px]' onClick={onSkip} disabled={disabled}>
                    Skip
                </Button>
                <Button type='button' variant='positive' size='lg' className='min-w-[200px]' onClick={onDone} disabled={disabled}>
                    Done
                </Button>
            </div>
            <p className='text-sm text-muted-foreground'>
                Press <kbd className={KBD_CLASS}>D</kbd> for Done or <kbd className={KBD_CLASS}>S</kbd> for Skip
            </p>
        </div>
    );
};
