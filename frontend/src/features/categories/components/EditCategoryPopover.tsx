import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FieldError } from '@/components/shared/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUpdateCategory } from '@/features/categories/queries/use-update-category';
import { updateCategoryFormSchema } from '@/features/categories/schemas';
import type { UpdateCategoryFormValues } from '@/features/categories/schemas';
import type { Category } from '@/features/categories/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';

type EditCategoryPopoverProps = {
    category: Category;
    /** Styling of the round trigger button, e.g. the row action colours */
    triggerClassName?: string;
};

export const EditCategoryPopover = ({ category, triggerClassName }: EditCategoryPopoverProps) => {
    const [open, setOpen] = useState(false);
    const { mutate: updateCategory, isPending } = useUpdateCategory();
    const inputId = `category-edit-name-${category.id}`;

    const form = useForm<UpdateCategoryFormValues>({
        resolver: zodResolver(updateCategoryFormSchema),
        defaultValues: {
            name: category.name,
        },
    });

    const { control, handleSubmit, reset } = form;

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (nextOpen) {
            reset({ name: category.name });
        }
    };

    const handleCancel = () => {
        reset({ name: category.name });
        setOpen(false);
    };

    const onSubmit = (values: UpdateCategoryFormValues) => {
        updateCategory(
            { categoryId: category.id, payload: values },
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
                            <Button variant='ghost' size='icon' aria-label='Edit category' className={triggerClassName}>
                                <PencilIcon />
                            </Button>
                        }
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Edit category name</p>
                </TooltipContent>
            </Tooltip>
            <PopoverContent align='end' className='w-64 rounded-2xl'>
                <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name='name'
                        render={({ field, fieldState }) => (
                            <div className='grid gap-2'>
                                <Label htmlFor={inputId}>Category name</Label>
                                <Input id={inputId} placeholder='e.g. English' aria-invalid={fieldState.invalid} {...field} />
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
};
