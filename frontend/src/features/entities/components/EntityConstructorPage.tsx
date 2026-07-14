import { useState } from 'react';
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
import { getCategoryById, getEntityById, getTopicById } from '@/features/entities/demo-data';
import { entityConstructorFormSchema } from '@/features/entities/schemas';
import type { BlockType, EntityConstructorFormValues } from '@/features/entities/types';
import { createBlock } from '@/features/entities/utils/block-factory';
import { toSaveEntityPayload } from '@/features/entities/utils/to-save-payload';

type EntityConstructorPageProps = {
    categoryId: string;
    topicId: string;
    entityId?: string;
};

export function EntityConstructorPage({ categoryId, topicId, entityId }: EntityConstructorPageProps) {
    const navigate = useNavigate();
    const [hoveredTemplate, setHoveredTemplate] = useState<BlockType | null>(null);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const category = getCategoryById(categoryId);
    const topic = getTopicById(topicId);
    const entity = entityId ? getEntityById(entityId) : undefined;
    const isEditMode = Boolean(entityId);

    const form = useForm<EntityConstructorFormValues>({
        resolver: zodResolver(entityConstructorFormSchema),
        defaultValues: {
            title: entity?.title ?? '',
            blocks: [],
        },
    });

    const { control, handleSubmit, formState } = form;
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'blocks',
    });

    if (!category || !topic || (isEditMode && !entity)) {
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

    function handleCancel() {
        if (formState.isDirty) {
            setCancelDialogOpen(true);
            return;
        }

        navigateToTopic();
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
        const body = toSaveEntityPayload(values);
        const method = isEditMode ? 'PATCH' : 'POST';
        const url = `/categories/${categoryId}/topics/${topicId}/entities${entityId ? `/${entityId}` : ''}`;

        console.log('[save entity]', { method, url, body });
    };

    return (
        <div className='min-h-screen bg-background'>
            <AppHeader />

            <PageContainer className='py-8'>
                <form className='flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex flex-col gap-1'>
                            <h1 className='font-heading text-2xl font-semibold tracking-tight'>{isEditMode ? 'Edit entity' : 'New entity'}</h1>
                            <AppBreadcrumbs category={{ id: categoryId, name: category.name }} topic={{ id: topicId, name: topic.name }} />
                        </div>

                        <div className='flex items-center gap-2'>
                            <Button type='button' variant='outline' onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type='submit'>Save</Button>
                        </div>
                    </div>

                    <div className='grid gap-6 md:grid-cols-2'>
                        <EntityContentPanel
                            control={control}
                            blocks={fields}
                            hoveredTemplate={hoveredTemplate}
                            onRemoveBlock={remove}
                            onReorderBlocks={handleReorderBlocks}
                        />

                        <EntityTemplatesPanel
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
