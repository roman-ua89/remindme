import { SECONDS_PER_DROP } from '@remindme/contracts/score';
import { useNavigate } from '@tanstack/react-router';

import { DropIcon } from '@/components/brand/DropIcon';
import { TreeIllustration } from '@/components/brand/TreeIllustration';
import type { TreeStage } from '@/components/brand/TreeIllustration';
import { WateringCan } from '@/components/brand/WateringCan';
import { Button } from '@/components/ui/button';
import { LibraryStats } from '@/features/home/components/LibraryStats';
import { getTreeStage } from '@/features/score/get-tree-stage';
import { useScore } from '@/features/score/queries/use-score';
import type { ScoreResponse } from '@/features/score/types';

const STAGE_NAMES: Record<TreeStage, string> = {
    1: 'Sprout',
    2: 'Seedling',
    3: 'Sapling',
    4: 'Leaves',
    5: 'Blossom',
    6: 'Apples',
};

const MINUTES_PER_DROP = SECONDS_PER_DROP / 60;

type ScoreNotesProps = {
    score: ScoreResponse;
};

/** Today's earned drops, the next step for the rest of today, and the level-down hint when decay lowered the level. */
const ScoreNotes = ({ score }: ScoreNotesProps) => {
    const remainingDrops = score.maxPerDay - score.earnedToday;

    return (
        <>
            <p className='text-[15px] text-muted-foreground'>
                {score.earnedToday} / {score.maxPerDay} today
            </p>
            <p className='text-[15px] text-muted-foreground'>
                {remainingDrops > 0
                    ? `Spend up to ${remainingDrops * MINUTES_PER_DROP} more minutes in the Player to earn the rest today.`
                    : `Come back tomorrow to earn up to ${score.maxPerDay} more drops.`}
            </p>
            {score.levelLost && (
                <p className='text-[15px] text-primary-hover'>Your tree lost a level — {MINUTES_PER_DROP} minutes in the Player brings it back</p>
            )}
        </>
    );
};

/**
 * Logged-in Home: the tree for the user's score, its drops and level, today's earned drops, the library stats and the way to the categories.
 * Until the score loads, the tree slot stays empty and the numbers show a dash, so no random or stale values flash in.
 * Below `lg` the CTA moves under the text column, so the text keeps its width at 768px.
 */
export const TreeCard = () => {
    const navigate = useNavigate();
    const { data: score } = useScore();
    const stage = score ? getTreeStage(score.totalDrops) : undefined;

    return (
        <section
            aria-labelledby='tree-card-title'
            className='grid grid-cols-[auto_1fr] items-center gap-x-7 gap-y-5 rounded-2xl border border-border bg-card px-7 py-5.5 lg:grid-cols-[auto_1fr_auto]'
        >
            <div className='flex items-end gap-1'>
                {stage ? <TreeIllustration stage={stage} className='size-35' /> : <div aria-hidden='true' className='size-35' />}
                <WateringCan />
            </div>

            <div className='flex min-w-0 flex-col gap-3.5'>
                <div className='flex flex-col gap-1'>
                    <h2 id='tree-card-title' className='font-heading text-[26px] font-medium text-foreground'>
                        {stage ? `Your tree · ${STAGE_NAMES[stage]}` : 'Your tree'}
                    </h2>
                    <p className='flex items-center gap-2 text-[17px] font-semibold text-foreground'>
                        <DropIcon />
                        {score ? `${score.totalDrops} ${score.totalDrops === 1 ? 'drop' : 'drops'} · Level ${score.level}` : '—'}
                    </p>
                    {score && <ScoreNotes score={score} />}
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
