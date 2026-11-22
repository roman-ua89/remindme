import { CircleCheckIcon, CircleIcon } from 'lucide-react';

import { AppHeader } from '@/components/layout/AppHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { devPlanTasks } from '@/features/dev-plan/tasks';
import { cn } from '@/lib/utils';

export function DevPlanPage() {
    const sortedTasks = [...devPlanTasks].sort((a, b) => Number(a.done) - Number(b.done));
    const completedCount = devPlanTasks.filter((task) => task.done).length;

    return (
        <div className='min-h-screen'>
            <AppHeader />

            <PageContainer className='py-8'>
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-heading text-2xl font-semibold tracking-tight'>MVP plan</h1>
                        <p className='text-sm text-muted-foreground'>
                            Dev-only checklist — edit <code className='rounded bg-muted px-1 py-0.5 text-xs'>src/features/dev-plan/tasks.ts</code> to
                            update tasks.
                        </p>
                    </div>

                    <p className='text-sm text-muted-foreground'>
                        {completedCount} of {devPlanTasks.length} done
                    </p>

                    <ul className='flex flex-col gap-2'>
                        {sortedTasks.map((task) => (
                            <li key={task.id} className='flex items-start gap-3 rounded-lg border border-border px-4 py-3'>
                                {task.done ? (
                                    <CircleCheckIcon className='mt-0.5 size-5 shrink-0 text-primary' aria-hidden />
                                ) : (
                                    <CircleIcon className='mt-0.5 size-5 shrink-0 text-muted-foreground' aria-hidden />
                                )}
                                <span className={cn('text-sm leading-relaxed', task.done && 'text-muted-foreground line-through')}>{task.label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </PageContainer>
        </div>
    );
}
