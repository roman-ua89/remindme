import type { ComponentType } from 'react';
import { TreeStage1 } from './tree/TreeStage1';
import { TreeStage2 } from './tree/TreeStage2';
import { TreeStage3 } from './tree/TreeStage3';
import { TreeStage4 } from './tree/TreeStage4';
import { TreeStage5 } from './tree/TreeStage5';
import { TreeStage6 } from './tree/TreeStage6';

export type TreeStage = 1 | 2 | 3 | 4 | 5 | 6;

type StageProps = { className?: string };

const STAGE_COMPONENTS: Record<TreeStage, ComponentType<StageProps>> = {
    1: TreeStage1,
    2: TreeStage2,
    3: TreeStage3,
    4: TreeStage4,
    5: TreeStage5,
    6: TreeStage6,
};

export const TreeIllustration = ({ stage, className }: { stage: TreeStage; className?: string }) => {
    const Stage = STAGE_COMPONENTS[stage];
    return <Stage className={className} />;
};
