type SunGlowProps = {
    gradation?: 1 | 2 | 3;
};

/**
 * Sun glow pinned to the top-left corner of its nearest positioned ancestor. Only gradation 2 is drawn;
 * 1 and 3 fall back to it. Opacity lives in the `sun-r*` colour tokens, so the circles set no fill-opacity.
 */
export const SunGlow = (_props: SunGlowProps) => (
    <svg width='420' height='420' viewBox='0 0 420 420' aria-hidden='true' className='pointer-events-none absolute top-0 left-0 -z-10'>
        <circle cx='0' cy='0' r='300' className='fill-sun-r300' />
        <circle cx='0' cy='0' r='210' className='fill-sun-r210' />
        <circle cx='0' cy='0' r='130' className='fill-sun-r130' />
        <circle cx='0' cy='0' r='70' className='fill-sun-r70' />
    </svg>
);
