import { useLocation, useNavigate } from '@tanstack/react-router';
import { PlayIcon, PlayOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PlayerScope } from '@/features/player/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '#/components/ui/tooltip.tsx';

type PlayButtonProps = {
    scope: PlayerScope;
    disabled?: boolean;
    ariaLabel: string;
    className?: string;
};

function toPlayerSearch(scope: PlayerScope) {
    switch (scope.type) {
        case 'category':
            return { categoryId: scope.categoryId };
        case 'topic':
            return { topicId: scope.topicId };
        case 'entity':
            return { entityId: scope.entityId };
    }
}

export const PlayButton = ({ scope, disabled = false, ariaLabel, className }: PlayButtonProps) => {
    const navigate = useNavigate();
    const returnTo = useLocation({ select: (location) => location.href });

    return (
        <Tooltip>
            <TooltipTrigger render={<span className='inline-flex' />}>
                <Button
                    variant='ghost'
                    size='icon'
                    aria-label={ariaLabel}
                    disabled={disabled}
                    className={className}
                    onClick={() => {
                        navigate({ to: '/player', search: { ...toPlayerSearch(scope), returnTo } });
                    }}
                >
                    {disabled ? <PlayOff className='text-destructive' /> : <PlayIcon className='text-positive' />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{disabled ? 'Category must have at least one entity' : ariaLabel}</p>
            </TooltipContent>
        </Tooltip>
    );
};
