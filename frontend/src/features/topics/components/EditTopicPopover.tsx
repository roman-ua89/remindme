import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FieldError } from '@/components/shared/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUpdateTopic } from '@/features/topics/queries/use-update-topic';
import { updateTopicFormSchema } from '@/features/topics/schemas';
import type { UpdateTopicFormValues } from '@/features/topics/schemas';
import type { Topic } from '@/features/topics/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';

type EditTopicPopoverProps = {
    topic: Topic;
};

export function EditTopicPopover({ topic }: EditTopicPopoverProps) {
    const [open, setOpen] = useState(false);
    const { mutate: updateTopic, isPending } = useUpdateTopic(topic.categoryId);
    const inputId = `topic-edit-name-${topic.id}`;

    const form = useForm<UpdateTopicFormValues>({
        resolver: zodResolver(updateTopicFormSchema),
        defaultValues: {
            name: topic.name,
        },
    });

    const { control, handleSubmit, reset } = form;

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (nextOpen) {
            reset({ name: topic.name });
        }
    };

    const handleCancel = () => {
        reset({ name: topic.name });
        setOpen(false);
    };

    const onSubmit = (values: UpdateTopicFormValues) => {
        updateTopic(
            { topicId: topic.id, payload: values },
            {
                onSuccess: () => {
                    reset({ name: values.name });
                    setOpen(false);
                },
            },
        );
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <Tooltip>
                <TooltipTrigger render={<span className='inline-flex' />}>
                    <PopoverTrigger
                        render={
                            <Button variant='ghost' size='icon-sm' aria-label='Edit topic'>
                                <PencilIcon />
                            </Button>
                        }
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Edit topic name</p>
                </TooltipContent>
            </Tooltip>
            <PopoverContent align='end' className='w-64'>
                <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name='name'
                        render={({ field, fieldState }) => (
                            <div className='grid gap-2'>
                                <Label htmlFor={inputId}>Topic name</Label>
                                <Input id={inputId} placeholder='e.g. Verbs' aria-invalid={fieldState.invalid} {...field} />
                                <FieldError message={fieldState.error?.message} />
                            </div>
                        )}
                    />
                    <div className='flex gap-2'>
                        <Button type='button' variant='outline' className='flex-1' onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type='submit' className='flex-1' disabled={isPending}>
                            {isPending ? 'Saving…' : 'Save'}
                        </Button>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}
