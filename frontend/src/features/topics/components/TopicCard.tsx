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
import { ListRow, listRowActionClassName } from '@/components/shared/ListRow';
import { VisibilitySwitch } from '@/components/shared/VisibilitySwitch';
import { Button } from '@/components/ui/button';
import { EntityMarkerDots } from '@/features/entities/components/EntityMarkerDots';
import { EditTopicPopover } from '@/features/topics/components/EditTopicPopover';
import { useSetTopicVisibility } from '@/features/topics/queries/use-set-topic-visibility';
import { PlayButton } from '@/features/player/components/PlayButton';
import type { Topic } from '@/features/topics/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';

type TopicCardProps = {
    topic: Topic;
    onDelete: (id: string) => void;
};

export const TopicCard = ({ topic, onDelete }: TopicCardProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { mutateAsync: setTopicVisibility } = useSetTopicVisibility();
    const canDelete = topic.entityCount === 0;
    const canPlay = topic.entityCount > 0;

    function handleRemove() {
        onDelete(topic.id);
        setDeleteDialogOpen(false);
    }

    return (
        <ListRow
            title={
                <Link to='/categories/$categoryId/topics/$topicId' params={{ categoryId: topic.categoryId, topicId: topic.id }}>
                    {topic.name}
                </Link>
            }
            meta={`${topic.entityCount} ${topic.entityCount === 1 ? 'entity' : 'entities'}`}
            hidden={topic.visibility === 'excluded'}
            details={
                <>
                    <EntityMarkerDots
                        hidden={topic.hasExcludedEntities}
                        hiddenLabel='Some entities are hidden from the Player'
                        markers={topic.markers}
                    />
                    <VisibilitySwitch
                        included={topic.visibility === 'included'}
                        disabled={topic.entityCount === 0}
                        onChange={(included) =>
                            setTopicVisibility({
                                categoryId: topic.categoryId,
                                topicId: topic.id,
                                visibility: included ? 'included' : 'excluded',
                            })
                        }
                        ariaLabel='Topic visibility'
                        onTooltip='Exclude all entities in this topic from the Player'
                        offTooltip='Include all entities in this topic in the Player'
                    />
                </>
            }
            actions={
                <>
                    <PlayButton
                        scope={{ type: 'topic', topicId: topic.id }}
                        disabled={!canPlay}
                        ariaLabel='Play topic'
                        className={listRowActionClassName.play}
                    />
                    <EditTopicPopover topic={topic} triggerClassName={listRowActionClassName.edit} />
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        {!canDelete ? (
                            <Tooltip>
                                <TooltipTrigger render={<span className='inline-flex' />}>
                                    <Button
                                        variant='destructive'
                                        size='icon'
                                        className={listRowActionClassName.remove}
                                        aria-label='Delete topic'
                                        disabled
                                    >
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
                                    <Button variant='destructive' size='icon' className={listRowActionClassName.remove} aria-label='Delete topic'>
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
                </>
            }
        />
    );
};
