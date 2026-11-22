import { Link } from '@tanstack/react-router';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageContainer } from '@/components/layout/PageContainer';
import { SproutLogo } from '@/components/brand/SproutLogo';
import { useCurrentUser } from '@/features/auth/queries/use-current-user';
import { useLogout } from '@/features/auth/queries/use-logout';
import { LoginDialog } from '@/features/auth/components/LoginDialog';
import { TodayPlayerTime } from '@/features/player/components/TodayPlayerTime';

export const AppHeader = () => {
    const { data: user, isPending: isUserPending } = useCurrentUser();
    const { mutate: logout, isPending } = useLogout();

    const menuLabel = user?.email ?? 'User menu';

    return (
        <header>
            <PageContainer className='flex h-[72px] items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link to='/' className='rounded-md outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50'>
                        <SproutLogo />
                    </Link>
                    {user ? <TodayPlayerTime /> : null}
                </div>

                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant='outline' className='gap-2 pl-1.5 pr-3 font-normal'>
                                    <span
                                        aria-hidden='true'
                                        className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary-hover'
                                    >
                                        {user.email.charAt(0).toUpperCase()}
                                    </span>
                                    <span className='max-w-[256px] truncate'>{menuLabel}</span>
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
