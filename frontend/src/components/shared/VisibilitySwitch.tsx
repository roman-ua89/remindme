import { startTransition, useOptimistic } from 'react';

import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type VisibilitySwitchProps = {
    included: boolean;
    /** Persists the change; must resolve once the server confirmed it. Rejection rolls the switch back. */
    onChange: (included: boolean) => Promise<unknown>;
    ariaLabel: string;
    /** Tooltip text while the switch is on */
    onTooltip: string;
    /** Tooltip text while the switch is off */
    offTooltip: string;
    disabled?: boolean;
};

export const VisibilitySwitch = ({ included, onChange, ariaLabel, onTooltip, offTooltip, disabled = false }: VisibilitySwitchProps) => {
    const [optimisticIncluded, setOptimisticIncluded] = useOptimistic(included);

    function handleCheckedChange(next: boolean) {
        startTransition(async () => {
            setOptimisticIncluded(next);
            try {
                await onChange(next);
            } catch {
                // Error is surfaced by the mutation; useOptimistic reverts to `included` once the transition ends.
            }
        });
    }

    return (
        <Tooltip>
            <TooltipTrigger render={<span className='inline-flex' />}>
                <Switch checked={optimisticIncluded} onCheckedChange={handleCheckedChange} aria-label={ariaLabel} disabled={disabled} />
            </TooltipTrigger>
            <TooltipContent>
                <p>{optimisticIncluded ? onTooltip : offTooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
};
