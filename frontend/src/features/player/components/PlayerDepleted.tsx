import { InboxIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

type PlayerDepletedProps = {
    onHome: () => void;
};

export const PlayerDepleted = ({ onHome }: PlayerDepletedProps) => {
    return (
        <Empty className='rounded-2xl border bg-card py-16'>
            <EmptyHeader>
                <EmptyMedia variant='icon' className='size-12 rounded-[10px] bg-primary-soft text-primary'>
                    <InboxIcon />
                </EmptyMedia>
                <EmptyTitle className='text-2xl'>Nothing to revise</EmptyTitle>
                <EmptyDescription>
                    This scope has no eligible entities. Add content or include entities in the Player, then try again.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button type='button' size='lg' onClick={onHome}>
                    Go to Home
                </Button>
            </EmptyContent>
        </Empty>
    );
};
