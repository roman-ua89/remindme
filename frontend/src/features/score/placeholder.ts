// TODO(score): replace with API
import type { TreeStage } from '@/components/brand/TreeIllustration';

const MAX_PER_DAY = 3;
const MAX_TOTAL_DROPS = 15;

let placeholderScore: { totalDrops: number; earnedToday: number; maxPerDay: number } | null = null;

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export const getPlaceholderScore = () => {
    if (placeholderScore === null) {
        const totalDrops = randomInt(0, MAX_TOTAL_DROPS);
        const earnedToday = randomInt(0, Math.min(MAX_PER_DAY, totalDrops));
        placeholderScore = { totalDrops, earnedToday, maxPerDay: MAX_PER_DAY };
    }
    return placeholderScore;
};

export const getTreeStage = (totalDrops: number): TreeStage => {
    if (totalDrops <= 1) return 1;
    if (totalDrops <= 3) return 2;
    if (totalDrops <= 5) return 3;
    if (totalDrops <= 8) return 4;
    if (totalDrops <= 11) return 5;
    return 6;
};
