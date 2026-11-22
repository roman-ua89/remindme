import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ActivityMonthNavProps = {
    month: Date;
    canGoPrev: boolean;
    canGoNext: boolean;
    onPrev: () => void;
    onNext: () => void;
};

export const ActivityMonthNav = ({ month, canGoPrev, canGoNext, onPrev, onNext }: ActivityMonthNavProps) => (
    <div className='flex items-center gap-2'>
        <Button variant='outline' size='sm' disabled={!canGoPrev} onClick={onPrev}>
            <ChevronLeft />
            Prev
        </Button>
        <span className='min-w-28 text-center text-[13px] font-medium text-muted-foreground tabular-nums'>{format(month, 'LLLL yyyy')}</span>
        <Button variant='outline' size='sm' disabled={!canGoNext} onClick={onNext}>
            Next
            <ChevronRight />
        </Button>
    </div>
);
