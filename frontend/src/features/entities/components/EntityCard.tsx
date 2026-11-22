import { PencilIcon, Trash2Icon } from 'lucide-react';
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
import { ListRow, listRowActionClassName } from '@/components/shared/ListRow';
import { VisibilitySwitch } from '@/components/shared/VisibilitySwitch';
import { EntityMarkerDots } from '@/features/entities/components/EntityMarkerDots';
import { useSetEntityVisibility } from '@/features/entities/queries/use-set-entity-visibility';
import { PlayButton } from '@/features/player/components/PlayButton';
import type { EntityListItem } from '@/features/entities/types';
import { Link, useParams } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';

type EntityCardProps = {
    entity: EntityListItem;
    onEdit: (id: string) => void;
    onRemove: (id: string) => void;
};

export const EntityCard = ({ entity, onEdit, onRemove }: EntityCardProps) => {
    const { categoryId, topicId } = useParams({
        from: '/_app/categories/$categoryId/topics/$topicId/',
    });
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const { mutateAsync: setEntityVisibility } = useSetEntityVisibility();

    function handleRemove() {
        onRemove(entity.id);
        setRemoveDialogOpen(false);
    }

    const dateFormat = 'd-MM-yyyy';
    const createdLabel = `Created ${format(parseISO(entity.createdAt), dateFormat)}`;
    const meta = entity.editedAt ? `${createdLabel} · Edited ${format(parseISO(entity.editedAt), dateFormat)}` : createdLabel;
    const isExcluded = entity.visibility === 'excluded';

    return (
        <ListRow
            title={
                <Link to='/categories/$categoryId/topics/$topicId/entities/$entityId' params={{ categoryId, topicId, entityId: entity.id }}>
                    {entity.title}
                </Link>
            }
            meta={meta}
            hidden={isExcluded}
            details={
                <>
                    <EntityMarkerDots hidden={isExcluded} markers={entity.marker ? [entity.marker] : []} />
                    <span className='text-sm tabular-nums text-muted-foreground'>{entity.revisedCount} revised</span>
                    <VisibilitySwitch
                        included={entity.visibility === 'included'}
                        onChange={(included) =>
                            setEntityVisibility({
                                categoryId,
                                topicId,
                                entityId: entity.id,
                                visibility: included ? 'included' : 'excluded',
                            })
                        }
                        ariaLabel='Entity visibility'
                        onTooltip='Shown in the Player'
                        offTooltip='Hidden from the Player'
                    />
                </>
            }
            actions={
                <>
                    <PlayButton scope={{ type: 'entity', entityId: entity.id }} ariaLabel='Play entity' className={listRowActionClassName.play} />
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Edit entity'
                        className={listRowActionClassName.edit}
                        onClick={() => onEdit(entity.id)}
                    >
                        <PencilIcon />
                    </Button>
                    <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                        <AlertDialogTrigger
                            render={
                                <Button variant='destructive' size='icon' className={listRowActionClassName.remove} aria-label='Remove entity'>
                                    <Trash2Icon />
                                </Button>
                            }
                        />
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove entity?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove &ldquo;{entity.title}&rdquo;. This action cannot be undone.
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
