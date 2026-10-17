import { Link } from '@tanstack/react-router';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageContainer } from '@/components/layout/PageContainer';
import { useCurrentUser } from '@/features/auth/queries/use-current-user';
import { useLogout } from '@/features/auth/queries/use-logout';
import { LoginDialog } from '@/features/auth/components/LoginDialog';

export const AppHeader = () => {
    const { data: user, isPending: isUserPending } = useCurrentUser();
    const { mutate: logout, isPending } = useLogout();

    const menuLabel = user?.email ?? 'User menu';

    return (
        <header className='border-b border-border'>
            <PageContainer className='flex h-14 items-center justify-between'>
                <Link to='/' className='font-heading text-lg font-semibold tracking-tight hover:text-primary'>
                    RemindMe
                </Link>

                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant='ghost' size='sm'>
                                    {menuLabel}
                                    <ChevronDownIcon />
                                </Button>
                            }
                        />
                        <DropdownMenuContent align='end' className='w-40'>
                            <DropdownMenuItem disabled={isPending} onClick={() => logout()}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : isUserPending ? null : (
                    <LoginDialog />
                )}
            </PageContainer>
        </header>
    );
};
