import { useNavigate } from '@tanstack/react-router';

import { DropIcon } from '@/components/brand/DropIcon';
import { TreeIllustration } from '@/components/brand/TreeIllustration';
import type { TreeStage } from '@/components/brand/TreeIllustration';
import { WateringCan } from '@/components/brand/WateringCan';
import { Button } from '@/components/ui/button';
import { LibraryStats } from '@/features/home/components/LibraryStats';
import { getPlaceholderScore, getTreeStage } from '@/features/score/placeholder';

const STAGE_NAMES: Record<TreeStage, string> = {
    1: 'Sprout',
    2: 'Seedling',
    3: 'Sapling',
    4: 'Leaves',
    5: 'Blossom',
    6: 'Apples',
};

/**
 * Logged-in Home: the tree for the placeholder score, its drops, the library stats and the way to the categories.
 * Below `lg` the CTA moves under the text column, so the text keeps its width at 768px.
 */
export const TreeCard = () => {
    const navigate = useNavigate();
    const { totalDrops, maxPerDay } = getPlaceholderScore();
    const stage = getTreeStage(totalDrops);

    return (
        <section
            aria-labelledby='tree-card-title'
            className='grid grid-cols-[auto_1fr] items-center gap-x-7 gap-y-5 rounded-2xl border border-border bg-card px-7 py-5.5 lg:grid-cols-[auto_1fr_auto]'
        >
            <div className='flex items-end gap-1'>
                <TreeIllustration stage={stage} className='size-35' />
                <WateringCan />
            </div>

            <div className='flex min-w-0 flex-col gap-3.5'>
                <div className='flex flex-col gap-1'>
                    <h2 id='tree-card-title' className='font-heading text-[26px] font-medium text-foreground'>
                        Your tree · {STAGE_NAMES[stage]}
                    </h2>
                    <p className='flex items-center gap-2 text-[17px] font-semibold text-foreground'>
                        <DropIcon />
                        {totalDrops} {totalDrops === 1 ? 'drop' : 'drops'}
                    </p>
                    <p className='text-[15px] text-muted-foreground'>Come back tomorrow to earn up to {maxPerDay} more drops.</p>
                </div>
                <LibraryStats />
            </div>

            <Button
                size='lg'
                className='col-start-2 h-14 justify-self-start px-7 text-lg lg:col-start-auto'
                onClick={() => navigate({ to: '/categories' })}
            >
                Open my categories
            </Button>
        </section>
    );
};
