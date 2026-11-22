import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { FieldError } from '@/components/shared/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateCategory } from '@/features/categories/queries/use-create-category';
import { createCategoryFormSchema } from '@/features/categories/schemas';
import type { CreateCategoryFormValues } from '@/features/categories/schemas';

export const AddCategoryPopover = () => {
    const [open, setOpen] = useState(false);
    const { mutate: createCategory, isPending } = useCreateCategory();

    const form = useForm<CreateCategoryFormValues>({
        resolver: zodResolver(createCategoryFormSchema),
        defaultValues: {
            name: '',
        },
    });

    const { control, handleSubmit, reset } = form;

    const onSubmit = (values: CreateCategoryFormValues) => {
        createCategory(values, {
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
                        Add category
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
                                <Label htmlFor='category-name'>Category name</Label>
                                <Input id='category-name' placeholder='e.g. English' aria-invalid={fieldState.invalid} {...field} />
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
