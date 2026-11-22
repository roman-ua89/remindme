import { useNavigate, useSearch } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from '@/features/auth/components/LoginForm';

/** Header "Log in" button plus the sign-in dialog. Open state lives in the home page URL (`/?login=true`). */
export const LoginDialog = () => {
    const { login } = useSearch({ strict: false });
    const navigate = useNavigate();

    const handleOpenChange = (open: boolean) => {
        void navigate({ to: '/', search: open ? { login: true } : {}, replace: !open });
    };

    return (
        <Dialog open={login === true} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button size='default' className='px-4 font-semibold' />}>Log in</DialogTrigger>
            <DialogContent className='gap-5 sm:max-w-sm'>
                <DialogHeader className='pr-8'>
                    <DialogTitle className='text-lg font-semibold'>Sign in</DialogTitle>
                    <DialogDescription>Enter your email and password to continue.</DialogDescription>
                </DialogHeader>
                <LoginForm />
            </DialogContent>
        </Dialog>
    );
};
