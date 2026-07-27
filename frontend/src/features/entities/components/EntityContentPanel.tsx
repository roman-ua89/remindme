import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Control, UseFieldArrayRemove } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BlockEditorRouter } from '@/features/entities/components/BlockEditorRouter';
import type { BlockType, EntityBlockForm, EntityConstructorFormValues } from '@/features/entities/types';
import { cn } from '@/lib/utils';
import { constants } from '#/lib/constants.ts';

type EntityContentPanelProps = {
    control: Control<EntityConstructorFormValues>;
    blocks: EntityBlockForm[];
    hoveredTemplate: BlockType | null;
    onRemoveBlock: UseFieldArrayRemove;
    onReorderBlocks: (from: number, to: number) => void;
};

type SortableBlockItemProps = {
    control: Control<EntityConstructorFormValues>;
    index: number;
    block: EntityBlockForm;
    onRemove: () => void;
};

function SortableBlockItem({ control, index, block, onRemove }: SortableBlockItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.clientId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className={cn(isDragging && 'opacity-60')}>
            <BlockEditorRouter control={control} index={index} block={block} dragHandleProps={{ ...attributes, ...listeners }} onRemove={onRemove} />
        </div>
    );
}

export function EntityContentPanel({ control, blocks, hoveredTemplate, onRemoveBlock, onReorderBlocks }: EntityContentPanelProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = blocks.findIndex((block) => block.clientId === active.id);
        const newIndex = blocks.findIndex((block) => block.clientId === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        onReorderBlocks(oldIndex, newIndex);
    }

    return (
        <div className='flex flex-col gap-4 flex-grow-1 '>
            <div className='grid gap-2'>
                <Label htmlFor='entity-title'>
                    Title <span className='text-stone-400'>(max {constants.maxTitleSymbols} symbols)</span> *
                </Label>
                <Controller
                    control={control}
                    name='title'
                    render={({ field, fieldState }) => (
                        <>
                            <Input
                                id='entity-title'
                                maxLength={constants.maxTitleSymbols}
                                placeholder='Entity title'
                                aria-invalid={fieldState.invalid}
                                {...field}
                            />
                            {fieldState.error ? <p className='text-sm text-destructive'>{fieldState.error.message}</p> : null}
                        </>
                    )}
                />
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map((block) => block.clientId)} strategy={verticalListSortingStrategy}>
                    <div className='flex flex-col gap-4'>
                        {blocks.map((block, index) => (
                            <SortableBlockItem
                                key={block.clientId}
                                control={control}
                                index={index}
                                block={block}
                                onRemove={() => onRemoveBlock(index)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {hoveredTemplate ? (
                <div className='flex min-h-24 items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-muted/40 px-4 py-8 text-sm text-muted-foreground'>
                    {hoveredTemplate.charAt(0).toUpperCase() + hoveredTemplate.slice(1)} block will be inserted here
                </div>
            ) : null}

            {blocks.length === 0 && !hoveredTemplate ? <p className='text-sm text-muted-foreground'>No blocks yet</p> : null}
        </div>
    );
}
