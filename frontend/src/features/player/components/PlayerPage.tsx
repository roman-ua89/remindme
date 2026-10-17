import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { PlayerActions } from '@/features/player/components/PlayerActions';
import { PlayerBatchCompleteDialog } from '@/features/player/components/PlayerBatchCompleteDialog';
import { PlayerDepleted } from '@/features/player/components/PlayerDepleted';
import { PlayerPreview } from '@/features/player/components/PlayerPreview';
import { PlayerProgress } from '@/features/player/components/PlayerProgress';
import { useMarkDone } from '@/features/player/queries/use-mark-done';
import { useMarkSkip } from '@/features/player/queries/use-mark-skip';
import { usePlayerBatch } from '@/features/player/queries/use-player-batch';
import type { PlayerScope } from '@/features/player/types';
import { advanceAfterAction, applyBatch, createEmptySession, getBatchProgress } from '@/features/player/utils/session';

type PlayerPageProps = {
    scope: PlayerScope;
};

export function PlayerPage({ scope }: PlayerPageProps) {
    const navigate = useNavigate();
    const [session, setSession] = useState(createEmptySession);
    const fetchBatch = usePlayerBatch();
    const markDone = useMarkDone();
    const markSkip = useMarkSkip();

    const currentEntity = session.queue[0];
    const isMutating = markDone.isPending || markSkip.isPending;
    const progress = getBatchProgress(session);
    const showProgress = session.status === 'playing' || session.status === 'batchComplete';

    function goHome() {
        navigate({ to: '/categories' });
    }

    function loadBatch(shownEntityIds: string[]) {
        setSession((current) => ({ ...current, status: 'loading' }));
        fetchBatch.mutate(
            { scope, shownEntityIds },
            {
                onSuccess: (result) => {
                    setSession((current) => applyBatch(current, result));
                },
                onError: () => {
                    setSession((current) => ({ ...current, status: 'error' }));
                },
            },
        );
    }

    useEffect(() => {
        loadBatch([]);
        // Remount via route key when scope changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleDone() {
        if (!currentEntity || isMutating) {
            return;
        }

        markDone.mutate(
            {
                categoryId: currentEntity.categoryId,
                topicId: currentEntity.topicId,
                entityId: currentEntity.id,
            },
            {
                onSuccess: () => {
                    setSession((current) => advanceAfterAction(current, currentEntity.id));
                },
            },
        );
    }

    function handleSkip() {
        if (!currentEntity || isMutating) {
            return;
        }

        markSkip.mutate(
            {
                categoryId: currentEntity.categoryId,
                topicId: currentEntity.topicId,
                entityId: currentEntity.id,
            },
            {
                onSuccess: () => {
                    setSession((current) => advanceAfterAction(current, currentEntity.id));
                },
            },
        );
    }

    return (
        <PageContainer className='py-8'>
            <div className='mb-6 flex items-center justify-between gap-4'>
                <h1 className='text-2xl font-semibold tracking-tight'>Player</h1>
                <Button type='button' variant='outline' onClick={goHome}>
                    Stop
                </Button>
            </div>

            {showProgress ? (
                <div className='mb-6'>
                    <PlayerProgress progress={progress} />
                </div>
            ) : null}

            {session.status === 'loading' ? (
                <div className='flex items-center justify-center gap-2 py-16 text-muted-foreground'>
                    <Spinner className='size-5' />
                    <p>Loading revision pack…</p>
                </div>
            ) : null}

            {session.status === 'error' ? (
                <div className='flex flex-col items-start gap-4 py-8'>
                    <p className='text-muted-foreground'>Unable to load a revision pack.</p>
                    <Button type='button' onClick={() => loadBatch(session.shownEntityIds)}>
                        Try again
                    </Button>
                </div>
            ) : null}

            {session.status === 'depleted' ? <PlayerDepleted onHome={goHome} /> : null}

            {session.status === 'playing' && currentEntity ? (
                <div className='flex flex-col gap-8'>
                    <PlayerPreview entity={currentEntity} />
                    <PlayerActions disabled={isMutating} onDone={handleDone} onSkip={handleSkip} />
                </div>
            ) : null}

            <PlayerBatchCompleteDialog
                open={session.status === 'batchComplete'}
                isLoading={fetchBatch.isPending}
                onNextBatch={() => loadBatch(session.shownEntityIds)}
                onHome={goHome}
            />
        </PageContainer>
    );
}
