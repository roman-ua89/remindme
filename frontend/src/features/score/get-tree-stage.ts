import { DROPS_PER_LEVEL, MAX_LEVEL } from '@remindme/contracts/score';

import type { TreeStage } from '@/components/brand/TreeIllustration';

/** Tree stage for a drop total: one stage per level, `level = min(floor(drops / DROPS_PER_LEVEL) + 1, MAX_LEVEL)`. */
export const getTreeStage = (totalDrops: number): TreeStage => {
    const level = Math.min(Math.floor(totalDrops / DROPS_PER_LEVEL) + 1, MAX_LEVEL);
    return level as TreeStage;
};
