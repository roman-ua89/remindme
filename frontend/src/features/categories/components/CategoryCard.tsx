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
import { EditCategoryPopover } from '@/features/categories/components/EditCategoryPopover';
import { EntityMarkerDots } from '@/features/entities/components/EntityMarkerDots';
import { PlayButton } from '@/features/player/components/PlayButton';
import type { Category } from '@/features/categories/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';

type CategoryCardProps = {
    category: Category;
    onDelete: (id: string) => void;
};

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const canDelete = category.topicCount === 0;
    const canPlay = category.entityCount > 0;

    function handleRemove() {
        onDelete(category.id);
        setDeleteDialogOpen(false);
    }

    return (
        <Card size='sm' className='transition-colors hover:bg-white/60'>
            <CardHeader>
                <CardTitle>
                    <Link to='/categories/$categoryId' params={{ categoryId: category.id }} className='block w-full py-1'>
                        {category.name}{' '}
                        <span className='text-stone-300'>
                            Topics: {category.topicCount} · Entities: {category.entityCount}
                        </span>
                    </Link>
                </CardTitle>
                <CardAction>
                    <div className='flex items-center gap-1'>
                        <EntityMarkerDots markers={category.markers} />
                        {canPlay && (
                            <span className='mr-1 text-base text-stone-300 flex gap-2 w-8'>
                                <span className='text-green-600'>{category.completion}%</span>
                            </span>
                        )}
                        <PlayButton scope={{ type: 'category', categoryId: category.id }} disabled={!canPlay} ariaLabel='Play category' />
                        <EditCategoryPopover category={category} />
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            {!canDelete ? (
                                <Tooltip>
                                    <TooltipTrigger render={<span className='inline-flex' />}>
                                        <Button variant='destructive' size='icon-sm' aria-label='Delete category' disabled>
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
                                        <Button variant='destructive' size='icon-sm' aria-label='Delete category'>
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
                    </div>
                </CardAction>
            </CardHeader>
        </Card>
    );
}
