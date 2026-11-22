import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FieldError } from '@/components/shared/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateTopic } from '@/features/topics/queries/use-create-topic';
import { createTopicFormSchema } from '@/features/topics/schemas';
import type { CreateTopicFormValues } from '@/features/topics/schemas';

type AddTopicPopoverProps = {
    categoryId: string;
};

export const AddTopicPopover = ({ categoryId }: AddTopicPopoverProps) => {
    const [open, setOpen] = useState(false);
    const { mutate: createTopic, isPending } = useCreateTopic(categoryId);

    const form = useForm<CreateTopicFormValues>({
        resolver: zodResolver(createTopicFormSchema),
        defaultValues: {
            name: '',
        },
    });

    const { control, handleSubmit, reset } = form;

    const onSubmit = (values: CreateTopicFormValues) => {
        createTopic(values, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button>
                        <PlusIcon />
                        Add topic
                    </Button>
                }
            />
            <PopoverContent align='end' className='w-64 rounded-2xl'>
                <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name='name'
                        render={({ field, fieldState }) => (
                            <div className='grid gap-2'>
                                <Label htmlFor='topic-name'>Topic name</Label>
                                <Input id='topic-name' placeholder='e.g. Verbs' aria-invalid={fieldState.invalid} {...field} />
                                <FieldError message={fieldState.error?.message} />
                            </div>
                        )}
                    />
                    <Button type='submit' className='w-full' disabled={isPending}>
                        {isPending ? 'Saving…' : 'Save'}
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    );
};
