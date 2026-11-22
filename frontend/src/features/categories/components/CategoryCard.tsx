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
import { ListRow, listRowActionClassName } from '@/components/shared/ListRow';
import { EditCategoryPopover } from '@/features/categories/components/EditCategoryPopover';
import { EntityMarkerDots } from '@/features/entities/components/EntityMarkerDots';
import { PlayButton } from '@/features/player/components/PlayButton';
import type { Category } from '@/features/categories/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';

type CategoryCardProps = {
    category: Category;
    onDelete: (id: string) => void;
};

export const CategoryCard = ({ category, onDelete }: CategoryCardProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const canDelete = category.topicCount === 0;
    const canPlay = category.entityCount > 0;

    function handleRemove() {
        onDelete(category.id);
        setDeleteDialogOpen(false);
    }

    return (
        <ListRow
            title={
                <Link to='/categories/$categoryId' params={{ categoryId: category.id }}>
                    {category.name}
                </Link>
            }
            meta={`${category.topicCount} ${category.topicCount === 1 ? 'topic' : 'topics'} · ${category.entityCount} ${category.entityCount === 1 ? 'entity' : 'entities'}`}
            details={
                <>
                    <EntityMarkerDots
                        hidden={category.hasExcludedEntities}
                        hiddenLabel='Some entities are hidden from the Player'
                        markers={category.markers}
                    />
                    {canPlay ? <span className='text-sm tabular-nums text-muted-foreground'>{category.completion}%</span> : null}
                </>
            }
            actions={
                <>
                    <PlayButton
                        scope={{ type: 'category', categoryId: category.id }}
                        disabled={!canPlay}
                        ariaLabel='Play category'
                        className={listRowActionClassName.play}
                    />
                    <EditCategoryPopover category={category} triggerClassName={listRowActionClassName.edit} />
                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        {!canDelete ? (
                            <Tooltip>
                                <TooltipTrigger render={<span className='inline-flex' />}>
                                    <Button
                                        variant='destructive'
                                        size='icon'
                                        className={listRowActionClassName.remove}
                                        aria-label='Delete category'
                                        disabled
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Only empty category can be removed</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <AlertDialogTrigger
                                render={
                                    <Button variant='destructive' size='icon' className={listRowActionClassName.remove} aria-label='Delete category'>
                                        <Trash2Icon />
                                    </Button>
                                }
                            />
                        )}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete category?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete &ldquo;{category.name}&rdquo;. This action cannot be undone.
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
