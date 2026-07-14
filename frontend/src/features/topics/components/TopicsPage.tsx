import { useState } from 'react';
import { useParams } from '@tanstack/react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs';
import { AddTopicPopover } from '@/features/topics/components/AddTopicPopover';
import { EmptyTopicPrompt } from '@/features/topics/components/EmptyTopicPrompt';
import { TopicList } from '@/features/topics/components/TopicList';
import { getCategoryById, getTopicsByCategoryId } from '@/features/topics/demo-data';
import type { Topic } from '@/features/topics/types';

export function TopicsPage() {
    const { categoryId } = useParams({ from: '/_app/categories/$categoryId/' });
    const category = getCategoryById(categoryId);

    const categoryName = category?.name ?? '';
    const [topics, setTopics] = useState<Topic[]>(() => getTopicsByCategoryId(categoryId));

    if (!category) {
        return (
            <div className='min-h-screen bg-background'>
                <AppHeader />
                <PageContainer className='flex flex-col gap-4 py-8'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Category not found</h1>
                        <AppBreadcrumbs />
                    </div>
                    <p className='text-muted-foreground'>Category not found.</p>
                </PageContainer>
            </div>
        );
    }

    function handleAddTopic(name: string) {
        setTopics((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                name,
                categoryId,
                entityCount: 0,
            },
        ]);
    }

    function handleRenameTopic(id: string) {
        const topic = topics.find((item) => item.id === id);
        if (!topic) return;

        const nextName = window.prompt('Rename topic', topic.name)?.trim();
        if (!nextName) return;

        setTopics((current) => current.map((item) => (item.id === id ? { ...item, name: nextName } : item)));
    }

    function handleDeleteTopic(id: string) {
        setTopics((current) => current.filter((item) => item.id !== id));
    }

    const hasTopics = topics.length > 0;

    return (
        <div className='min-h-screen bg-background'>
            <AppHeader />

            <PageContainer className='py-8'>
                <div className='flex flex-col gap-6'>
                    {hasTopics ? (
                        <>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex items-center gap-2'>
                                        <h1 className='font-heading text-2xl font-semibold tracking-tight'>Topics</h1>
                                    </div>
                                    <AppBreadcrumbs category={{ id: categoryId, name: categoryName }} />
                                </div>
                                <AddTopicPopover onSave={handleAddTopic} />
                            </div>

                            <TopicList topics={topics} onRename={handleRenameTopic} onDelete={handleDeleteTopic} />
                        </>
                    ) : (
                        <>
                            <div className='flex flex-col items-center gap-1'>
                                <h1 className='font-heading text-2xl font-semibold tracking-tight'>{categoryName}</h1>
                                <AppBreadcrumbs category={{ id: categoryId, name: categoryName }} />
                            </div>
                            <EmptyTopicPrompt onAddTopic={handleAddTopic} />
                        </>
                    )}
                </div>
            </PageContainer>
        </div>
    );
}
