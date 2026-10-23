import type { Control, FieldPath } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FieldError } from '@/components/shared/FieldError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EntityConstructorFormValues } from '@/features/entities/types';
import { constants } from '@/lib/constants';

type LinkBlockEditorProps = {
    control: Control<EntityConstructorFormValues>;
    name: FieldPath<EntityConstructorFormValues>;
};

export const LinkBlockEditor = ({ control, name }: LinkBlockEditorProps) => {
    const titleId = `${name}-link-title`;
    const urlId = `${name}-link-url`;

    return (
        <div className='flex flex-col gap-3'>
            <div className='grid gap-2'>
                <Label htmlFor={titleId}>
                    Title <span className='text-stone-400'>(max {constants.maxTitleSymbols} symbols)</span>
                </Label>
                <Controller
                    control={control}
                    name={`${name}.contentJson.title` as 'blocks.0.contentJson.title'}
                    render={({ field, fieldState }) => (
                        <>
                            <Input
                                {...field}
                                value={(field.value as string | undefined) ?? ''}
                                id={titleId}
                                maxLength={constants.maxTitleSymbols}
                                placeholder='Link title'
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldError message={fieldState.error?.message} />
                        </>
                    )}
                />
            </div>
            <div className='grid gap-2'>
                <Label htmlFor={urlId}>URL *</Label>
                <Controller
                    control={control}
                    name={`${name}.contentJson.url` as 'blocks.0.contentJson.url'}
                    render={({ field, fieldState }) => (
                        <>
                            <Input
                                {...field}
                                value={(field.value as string | undefined) ?? ''}
                                id={urlId}
                                type='url'
                                placeholder='https://example.com'
                                aria-invalid={fieldState.invalid}
                            />
                            <FieldError message={fieldState.error?.message} />
                        </>
                    )}
                />
            </div>
        </div>
    );
};
