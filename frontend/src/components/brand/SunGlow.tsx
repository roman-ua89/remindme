export type SunGradation = 1 | 2 | 3;

type SunGlowProps = {
    gradation?: SunGradation;
};

type SunCircle = {
    r: number;
    className: string;
};

/**
 * Circles of each sun export, largest first. Colour and opacity live in each `sun-r*` token, so the circles set no fill-opacity.
 */
const SUN_CIRCLES: Record<SunGradation, SunCircle[]> = {
    1: [
        { r: 220, className: 'fill-sun-r220' },
        { r: 150, className: 'fill-sun-r150' },
        { r: 95, className: 'fill-sun-r95' },
        { r: 50, className: 'fill-sun-r50' },
    ],
    2: [
        { r: 300, className: 'fill-sun-r300' },
        { r: 210, className: 'fill-sun-r210' },
        { r: 130, className: 'fill-sun-r130' },
        { r: 70, className: 'fill-sun-r70' },
    ],
    3: [
        { r: 380, className: 'fill-sun-r380' },
        { r: 280, className: 'fill-sun-r280' },
        { r: 180, className: 'fill-sun-r180' },
        { r: 110, className: 'fill-sun-r110' },
        { r: 84, className: 'fill-sun-r84' },
    ],
};

/**
 * Sun glow pinned to the top-left corner of its nearest positioned ancestor. Draws the given gradation; defaults to 2 (guests).
 */
export const SunGlow = ({ gradation = 2 }: SunGlowProps) => (
    <svg width='420' height='420' viewBox='0 0 420 420' aria-hidden='true' className='pointer-events-none absolute top-0 left-0 -z-10'>
        {SUN_CIRCLES[gradation].map(({ r, className }) => (
            <circle key={r} cx='0' cy='0' r={r} className={className} />
        ))}
    </svg>
);
