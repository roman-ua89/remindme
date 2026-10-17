import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { FieldError } from '@/components/shared/FieldError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/features/auth/queries/use-login';
import { loginFormSchema } from '@/features/auth/schemas';
import type { LoginFormValues } from '@/features/auth/schemas';

export const LoginForm = () => {
    const { mutate: login, isPending } = useLogin();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { control, handleSubmit } = form;

    const onSubmit = (values: LoginFormValues) => {
        login(values);
    };

    return (
        <form className='grid gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name='email'
                render={({ field, fieldState }) => (
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input id='email' type='email' autoComplete='email' aria-invalid={fieldState.invalid} {...field} />
                        <FieldError message={fieldState.error?.message} />
                    </div>
                )}
            />

            <Controller
                control={control}
                name='password'
                render={({ field, fieldState }) => (
                    <div className='grid gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input id='password' type='password' autoComplete='current-password' aria-invalid={fieldState.invalid} {...field} />
                        <FieldError message={fieldState.error?.message} />
                    </div>
                )}
            />

            <Button type='submit' size='lg' className='mt-1 w-full' disabled={isPending}>
                {isPending ? 'Signing in…' : 'Sign in'}
            </Button>
        </form>
    );
};
