import { useLayoutEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm, useFieldArray } from 'react-hook-form';

import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { AppBreadcrumbs } from '@/components/shared/AppBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EntityContentPanel } from '@/features/entities/components/EntityContentPanel';
import { EntityTemplatesPanel } from '@/features/entities/components/EntityTemplatesPanel';
import { useCreateEntity } from '@/features/entities/queries/use-create-entity';
import { useEntity } from '@/features/entities/queries/use-entity';
import { useSetEntityMarker } from '@/features/entities/queries/use-set-entity-marker';
import { useSetEntityVisibility } from '@/features/entities/queries/use-set-entity-visibility';
import { useUpdateEntity } from '@/features/entities/queries/use-update-entity';
import { entityConstructorFormSchema } from '@/features/entities/schemas';
import type { BlockType, EntityConstructorFormValues, EntityMarker, EntityVisibility } from '@/features/entities/types';
import { createBlock } from '@/features/entities/utils/block-factory';
import { toEntityFormValues } from '@/features/entities/utils/to-form-values';
import { toSaveEntityPayload } from '@/features/entities/utils/to-save-payload';
import { useCategory } from '@/features/categories/queries/use-category';
import { useTopic } from '@/features/topics/queries/use-topic';
import { useDeleteEntity } from '#/features/entities/queries/use-delete-entity.ts';
import { Spinner } from '#/components/ui/spinner.tsx';
import { AlertDialog } from '#/components/ui/alert-dialog.tsx';
import { EntityPreview } from '#/features/entities/components/EntityPreview.tsx';
import { ChevronLeft, Save, Trash2 } from 'lucide-react';

type EntityConstructorPageProps = {
    categoryId: string;
    topicId: string;
    entityId?: string;
};

export function EntityConstructorPage({ categoryId, topicId, entityId }: EntityConstructorPageProps) {
    const navigate = useNavigate();
    const [hoveredTemplate, setHoveredTemplate] = useState<BlockType | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } = useCategory(categoryId);
    const { data: topic, isLoading: isTopicLoading, isError: isTopicError } = useTopic(categoryId, topicId);
    const { mutate: createEntity, isPending: isCreating } = useCreateEntity(categoryId, topicId);
    const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useEntity({ categoryId, topicId, entityId });
    const { mutate: updateEntity, isPending: isUpdating } = useUpdateEntity(categoryId, topicId, entityId ?? '');
    const { mutate: deleteEntity, isPending: isDeleting } = useDeleteEntity(categoryId, topicId);
    const { mutateAsync: setEntityMarker } = useSetEntityMarker();
    const { mutateAsync: setEntityVisibility } = useSetEntityVisibility();

    const isEditMode = Boolean(entityId);
    const isLoading = isCategoryLoading || isTopicLoading || (isEditMode && isEntityLoading);
    const isSaving = isCreating || isUpdating;

    function handleMarkerChange(marker: EntityMarker | null) {
        if (!entityId) return Promise.resolve();
        return setEntityMarker({ categoryId, topicId, entityId, marker });
    }

    function handleVisibilityChange(visibility: EntityVisibility) {
        if (!entityId) return Promise.resolve();
        return setEntityVisibility({ categoryId, topicId, entityId, visibility });
    }

    const form = useForm<EntityConstructorFormValues>({
        resolver: zodResolver(entityConstructorFormSchema),
        defaultValues: {
            title: '',
            blocks: [],
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isDirty: isFormDirty },
    } = form;
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'blocks',
    });

    const watchTitle = watch('title');

    const lastResetKeyRef = useRef<string | null>(null);

    useLayoutEffect(() => {
        if (!entity) return;

        // Only Constructor saves change editedAt; visibility/marker refetches keep the same key and must not wipe unsaved edits.
        const resetKey = `${entity.id}:${entity.editedAt ?? entity.createdAt}`;
        if (lastResetKeyRef.current === resetKey) return;

        lastResetKeyRef.current = resetKey;
        reset(toEntityFormValues(entity));
    }, [entity, reset]);

    if (isLoading) {
        return (
            <div className='min-h-screen'>
                <AppHeader />
                <PageContainer className='flex flex-col gap-4 py-8'>
                    <p className='text-muted-foreground'>Loading entity constructor…</p>
                </PageContainer>
            </div>
        );
    }

    if (isCategoryError || isTopicError || !category || !topic || (isEditMode && (isEntityError || !entity))) {
        return (
            <div className='min-h-screen'>
                <AppHeader />
                <PageContainer className='flex flex-col gap-4 py-8'>
                    <h1 className='font-heading text-2xl font-semibold tracking-tight'>Entity not found</h1>
                    <p className='text-muted-foreground'>Unable to load entity constructor.</p>
                </PageContainer>
            </div>
        );
    }

    function navigateToTopic() {
        navigate({
            to: '/categories/$categoryId/topics/$topicId',
            params: { categoryId, topicId },
        });
    }

    function handleInsertTemplate(type: BlockType) {
        if (fields.length >= 20) return;
        append(createBlock(type));
        setHoveredTemplate(null);
    }

    function handleReorderBlocks(from: number, to: number) {
        move(from, to);
    }

    const onSubmit = (values: EntityConstructorFormValues) => {
        const payload = toSaveEntityPayload(values);

        if (isEditMode && entityId) {
            updateEntity(payload);
            return;
        }

        createEntity(payload);
    };

    const showDeleteConfirmation = () => {
        if (isEditMode && entityId) {
            setDeleteDialogOpen(true);
        }
    };

    const handleDelete = () => {
        if (isEditMode && entityId) {
            deleteEntity(
                { entityId },
                {
                    onSuccess: () => {
                        setDeleteDialogOpen(false);
                        navigateToTopic();
                    },
                },
            );
        }
    };

    const returnBack = () => {
        if (!isFormDirty) {
            navigateToTopic();
        } else {
            setCancelDialogOpen(true);
        }
    };

    const togglePreviewMode = () => {
        setIsPreviewMode(!isPreviewMode);
    };

    return (
        <div className='min-h-screen'>
            <AppHeader />

            {isPreviewMode ? (
                <EntityPreview categoryId={categoryId} topicId={topicId} entityId={entityId} togglePreviewMode={togglePreviewMode} />
            ) : null}

            <PageContainer className={`py-8 ${isPreviewMode ? 'hidden' : ''}`}>
                <form className='flex flex-col gap-6 mb-6' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex min-w-0 flex-col gap-1 mb-2'>
                            <AppBreadcrumbs
                                category={{ id: categoryId, name: category.name }}
                                topic={{ id: topicId, name: topic.name }}
                                entity={{ id: entityId ?? '', name: watchTitle || entity?.title || '' }}
                            />
                        </div>

                        <div className='flex shrink-0 items-center gap-2'>
                            <Button onClick={returnBack} variant={'outline'}>
                                <ChevronLeft /> Back
                            </Button>
                            <Button type='submit' variant='positive' disabled={isSaving || !isFormDirty || !fields.length}>
                                <Save /> {isSaving ? 'Saving…' : 'Save'}
                            </Button>
                        </div>
                    </div>

                    <div className='flex gap-6'>
                        <EntityContentPanel
                            control={control}
                            blocks={fields}
                            hoveredTemplate={hoveredTemplate}
                            onRemoveBlock={remove}
                            onReorderBlocks={handleReorderBlocks}
                            marker={entity?.marker ?? null}
                            onMarkerChange={handleMarkerChange}
                            markerDisabled={!isEditMode}
                        />

                        <EntityTemplatesPanel
                            blocks={fields}
                            entityId={entityId}
                            blockCount={fields.length}
                            onHoverTemplate={setHoveredTemplate}
                            onInsertTemplate={handleInsertTemplate}
                            togglePreviewMode={togglePreviewMode}
                            visibility={entity?.visibility}
                            onVisibilityChange={handleVisibilityChange}
                        />
                    </div>
                </form>
                {isEditMode && (
                    <Button variant='destructive' onClick={showDeleteConfirmation}>
                        <Trash2 /> Delete this entity
                    </Button>
                )}
            </PageContainer>

            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Discard changes?</DialogTitle>
                        <DialogDescription>You have unsaved changes. Are you sure you want to leave?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type='button' variant='outline' onClick={() => setCancelDialogOpen(false)}>
                            Keep editing
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            onClick={() => {
                                setCancelDialogOpen(false);
                                navigateToTopic();
                            }}
                        >
                            Discard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete <b>"{watchTitle}"</b>. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type='button' variant='outline' onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            disabled={isDeleting}
                            type='button'
                            variant='destructive'
                            onClick={() => {
                                handleDelete();
                            }}
                        >
                            {isDeleting && <Spinner />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </AlertDialog>
        </div>
    );
}
