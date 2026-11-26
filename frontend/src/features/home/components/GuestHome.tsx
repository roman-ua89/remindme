import { useNavigate } from '@tanstack/react-router';

import { TreeIllustration } from '@/components/brand/TreeIllustration';
import type { TreeStage } from '@/components/brand/TreeIllustration';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';

type GrowthStage = {
    stage: TreeStage;
    name: string;
    drops: string;
};

const GROWTH_STAGES: GrowthStage[] = [
    { stage: 1, name: 'Sprout', drops: '0 drops' },
    { stage: 4, name: 'Leaves', drops: '9 drops' },
    { stage: 6, name: 'Apples', drops: '15 drops' },
];

/** Home page for guests: hero with a login-dialog CTA and the "Grow your tree" explainer. */
export const GuestHome = () => {
    const navigate = useNavigate();

    return (
        <PageContainer className='flex flex-col items-center pt-22 pb-24 text-center'>
            <section className='flex w-full flex-col items-center'>
                <p className='mb-5 text-[13px] font-semibold tracking-[0.12em] text-primary-hover uppercase'>A few minutes a day</p>
                <h1 className='max-w-[900px] font-heading text-[54px] leading-[1.1] font-medium tracking-[-0.02em] text-foreground'>
                    Remember what you&apos;ve learned.
                </h1>
                <p className='mt-5 max-w-[640px] text-[23px] leading-[1.6] text-muted-foreground'>
                    Make your own cards, review them in short daily sessions, and watch your tree grow as your knowledge sticks.
                </p>
                <Button size='xl' className='mt-9 px-[34px] text-[21px]' onClick={() => navigate({ to: '/', search: { login: true } })}>
                    See how it works
                </Button>
            </section>

            <section aria-labelledby='growth-title' className='mt-20 flex w-full flex-col items-center gap-7'>
                <div className='flex flex-col items-center gap-2'>
                    <h2 id='growth-title' className='font-heading text-[30px] font-medium tracking-[-0.01em] text-foreground'>
                        Grow your tree
                    </h2>
                    <p className='text-[17px] leading-[1.6] text-muted-foreground'>
                        Revise every day and your tree grows. Miss a few days and it starts to shrink.
                    </p>
                </div>

                <ol className='grid w-full list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5'>
                    {GROWTH_STAGES.map((growth) => (
                        <li
                            key={growth.name}
                            className='flex flex-col items-center justify-end gap-3 rounded-xl border border-border bg-card px-5 pt-6 pb-5'
                        >
                            <TreeIllustration stage={growth.stage} className='size-60' />
                            <div className='flex flex-col items-center gap-0.5'>
                                <span className='text-base font-semibold text-foreground'>{growth.name}</span>
                                <span className='text-sm text-muted-foreground'>{growth.drops}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>
        </PageContainer>
    );
};
