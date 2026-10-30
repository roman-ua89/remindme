import { Link } from '@tanstack/react-router';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card';
import { EntityMarkerDots } from '@/features/entities/components/EntityMarkerDots';
import { EditTopicPopover } from '@/features/topics/components/EditTopicPopover';
import { PlayButton } from '@/features/player/components/PlayButton';
import type { Topic } from '@/features/topics/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';

type TopicCardProps = {
    topic: Topic;
    onDelete: (id: string) => void;
};

export function TopicCard({ topic, onDelete }: TopicCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const canDelete = topic.entityCount === 0;
    const canPlay = topic.entityCount > 0;

    function handleRemove() {
        onDelete(topic.id);
        setDeleteDialogOpen(false);
    }

    return (
        <Card size='sm' className='transition-colors hover:bg-white/60'>
            <CardHeader>
                <CardTitle>
                    <Link
                        to='/categories/$categoryId/topics/$topicId'
                        params={{ categoryId: topic.categoryId, topicId: topic.id }}
                        className='block w-full py-1'
                    >
                        {topic.name} <span className='text-stone-300'>Entities: {topic.entityCount}</span>
                    </Link>
                </CardTitle>
                <CardAction>
                    <div className='flex items-center gap-1'>
                        <EntityMarkerDots markers={topic.markers} />
                        <PlayButton scope={{ type: 'topic', topicId: topic.id }} disabled={!canPlay} ariaLabel='Play topic' />
                        <EditTopicPopover topic={topic} />
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            {!canDelete ? (
                                <Tooltip>
                                    <TooltipTrigger render={<span className='inline-flex' />}>
                                        <Button variant='destructive' size='icon-sm' aria-label='Delete topic' disabled>
                                            <Trash2Icon />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Only empty topic can be removed</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <AlertDialogTrigger
                                    render={
                                        <Button variant='destructive' size='icon-sm' aria-label='Delete topic'>
                                            <Trash2Icon />
                                        </Button>
                                    }
                                />
                            )}
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete topic?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete &ldquo;{topic.name}&rdquo;. This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel variant='default'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction variant='destructive' onClick={handleRemove}>
                                        Remove
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardAction>
            </CardHeader>
        </Card>
    );
}
