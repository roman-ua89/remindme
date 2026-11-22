import { useNavigate } from '@tanstack/react-router';

import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { DailyActivityChart } from '@/features/activity/components/DailyActivityChart';
import { PlayerTimeChart } from '@/features/activity/components/PlayerTimeChart';
import { useCurrentUser } from '@/features/auth/queries/use-current-user';
import { GuestHome } from '@/features/home/components/GuestHome';
import { LibraryStats } from '@/features/home/components/LibraryStats';

export const HomePage = () => {
    const { data: user } = useCurrentUser();
    const navigate = useNavigate();
    const isLoggedIn = Boolean(user);

    return (
        <div className='min-h-screen'>
            <AppHeader />

            {isLoggedIn ? (
                <PageContainer className='flex flex-col gap-14 py-18'>
                    <section className='flex max-w-[720px] flex-col gap-4'>
                        <h1 className='font-heading text-4xl leading-tight font-bold tracking-tight sm:text-[44px] sm:leading-[1.1]'>
                            Revise what you&apos;ve learned, before you forget it.
                        </h1>
                        <p className='text-lg leading-relaxed text-muted-foreground'>Structure your knowledge and make it sharp.</p>
                        <div className='mt-2'>
                            <Button size='lg' className='h-11 px-5 font-semibold' onClick={() => navigate({ to: '/categories' })}>
                                Open my categories
                            </Button>
                        </div>
                    </section>

                    <LibraryStats />
                    <DailyActivityChart />
                    <PlayerTimeChart />
                </PageContainer>
            ) : (
                <GuestHome />
            )}
        </div>
    );
};
