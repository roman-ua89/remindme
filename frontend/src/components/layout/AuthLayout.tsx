import type { ReactNode } from 'react';

type AuthLayoutProps = {
    children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className='flex min-h-svh items-center justify-center px-6 py-12'>
            <div className='w-full max-w-[400px]'>{children}</div>
        </div>
    );
}
