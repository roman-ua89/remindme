import { InboxIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

type PlayerDepletedProps = {
    onHome: () => void
}

export function PlayerDepleted({ onHome }: PlayerDepletedProps) {
    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>Nothing to revise</EmptyTitle>
                <EmptyDescription>
                    This scope has no eligible entities. Add content or include entities in the Player, then try again.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button type="button" onClick={onHome}>
                    Go to Home
                </Button>
            </EmptyContent>
        </Empty>
    )
}
