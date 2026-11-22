import { BookOpenIcon } from 'lucide-react';

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { AddTopicPopover } from '@/features/topics/components/AddTopicPopover';

type EmptyTopicPromptProps = {
    categoryId: string;
};

export const EmptyTopicPrompt = ({ categoryId }: EmptyTopicPromptProps) => {
    return (
        <Empty className='rounded-2xl border bg-card'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <BookOpenIcon />
                </EmptyMedia>
                <EmptyTitle>No topics yet</EmptyTitle>
                <EmptyDescription>Create your first topic to start adding reminders and entities.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <AddTopicPopover categoryId={categoryId} />
            </EmptyContent>
        </Empty>
    );
};
