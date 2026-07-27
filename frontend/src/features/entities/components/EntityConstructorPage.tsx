import { useLayoutEffect, useState } from 'react';
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
import { useUpdateEntity } from '@/features/entities/queries/use-update-entity';
import { entityConstructorFormSchema } from '@/features/entities/schemas';
import type { BlockType, EntityConstructorFormValues } from '@/features/entities/types';
import { createBlock } from '@/features/entities/utils/block-factory';
import { toEntityFormValues } from '@/features/entities/utils/to-form-values';
import { toSaveEntityPayload } from '@/features/entities/utils/to-save-payload';
import { useCategory } from '@/features/categories/queries/use-category';
import { useTopic } from '@/features/topics/queries/use-topic';

type EntityConstructorPageProps = {
    categoryId: string;
    topicId: string;
    entityId?: string;
};

export function EntityConstructorPage({ categoryId, topicId, entityId }: EntityConstructorPageProps) {
    const navigate = useNavigate();
    const [hoveredTemplate, setHoveredTemplate] = useState<BlockType | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } = useCategory(categoryId);
    const { data: topic, isLoading: isTopicLoading, isError: isTopicError } = useTopic(categoryId, topicId);
    const { mutate: createEntity, isPending: isCreating } = useCreateEntity(categoryId, topicId);
    const { data: entity, isLoading: isEntityLoading, isError: isEntityError } = useEntity(categoryId, topicId, entityId);
    const { mutate: updateEntity, isPending: isUpdating } = useUpdateEntity(categoryId, topicId, entityId ?? '');

    const isEditMode = Boolean(entityId);
    const isLoading = isCategoryLoading || isTopicLoading || (isEditMode && isEntityLoading);
    const isSaving = isCreating || isUpdating;

    const form = useForm<EntityConstructorFormValues>({
        resolver: zodResolver(entityConstructorFormSchema),
        defaultValues: {
            title: '',
            blocks: [],
        },
    });

    const { control, handleSubmit, reset, watch, formState: { isDirty: isFormDirty } } = form;
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'blocks',
    });

    const watchTitle = watch('title');

    useLayoutEffect(() => {
        if (entity) {
            reset(toEntityFormValues(entity));
        }
    }, [entity, reset]);

    if (isLoading) {
        return (
            <div className='min-h-screen bg-background'>
                <AppHeader />
                <PageContainer className='flex flex-col gap-4 py-8'>
                    <p className='text-muted-foreground'>Loading entity constructor…</p>
                </PageContainer>
            </div>
        );
    }

    if (isCategoryError || isTopicError || !category || !topic || (isEditMode && (isEntityError || !entity))) {
        return (
            <div className='min-h-screen bg-background'>
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

    const returnBack = () => {
        if (!isFormDirty) {
            navigateToTopic();
        } else {
            setCancelDialogOpen(true);
        }
    }

    return (
        <div className='min-h-screen bg-background'>
            <AppHeader />

            <PageContainer className='py-8'>
                <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex flex-col gap-1 mb-6'>
                            <h1 className='font-heading text-2xl font-semibold tracking-tight'>{isEditMode ? 'Edit entity' : 'New entity'}</h1>
                            <AppBreadcrumbs
                                category={{ id: categoryId, name: category.name }}
                                topic={{ id: topicId, name: topic.name }}
                                entity={{ id: entityId ?? '', name: watchTitle || entity?.title || '' }}
                            />
                        </div>

                        <div className='flex items-center gap-2'>
                            <Button onClick={returnBack} variant={"outline"}>
                                Back
                            </Button>
                            <Button type='submit' disabled={isSaving || !isFormDirty || !fields.length}>
                                {isSaving ? 'Saving…' : 'Save'}
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
                        />

                        <EntityTemplatesPanel
                            blocks={fields}
                            entityId={entityId}
                            blockCount={fields.length}
                            onHoverTemplate={setHoveredTemplate}
                            onInsertTemplate={handleInsertTemplate}
                        />
                    </div>
                </form>
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
        </div>
    );
}
