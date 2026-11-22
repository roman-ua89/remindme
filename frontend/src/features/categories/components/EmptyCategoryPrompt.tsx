import { FolderOpenIcon } from 'lucide-react';

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { AddCategoryPopover } from '@/features/categories/components/AddCategoryPopover';

export const EmptyCategoryPrompt = () => {
    return (
        <Empty className='rounded-2xl border bg-card'>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <FolderOpenIcon />
                </EmptyMedia>
                <EmptyTitle>No categories yet</EmptyTitle>
                <EmptyDescription>Create your first category to start organizing topics and reminders.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <AddCategoryPopover />
            </EmptyContent>
        </Empty>
    );
};
