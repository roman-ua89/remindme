import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { DailyActivityChart } from '@/features/activity/components/DailyActivityChart';
import { PlayerTimeChart } from '@/features/activity/components/PlayerTimeChart';
import { useCurrentUser } from '@/features/auth/queries/use-current-user';
import { GuestHome } from '@/features/home/components/GuestHome';
import { TreeCard } from '@/features/home/components/TreeCard';

export const HomePage = () => {
    const { data: user } = useCurrentUser();
    const isLoggedIn = Boolean(user);

    return (
        <div className='min-h-screen'>
            <AppHeader />

            {isLoggedIn ? (
                <PageContainer className='flex flex-col gap-5.5 py-7'>
                    <TreeCard />

                    <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
                        <DailyActivityChart />
                        <PlayerTimeChart />
                    </div>
                </PageContainer>
            ) : (
                <GuestHome />
            )}
        </div>
    );
};
