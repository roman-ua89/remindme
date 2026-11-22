export const DropIcon = ({ className }: { className?: string }) => (
    <svg width='16' height='22' viewBox='-9 -12 18 25' aria-hidden='true' className={className}>
        <path
            d='M0 -10 C3 -5 7 -1 7 4 A7 7 0 0 1 -7 4 C-7 -1 -3 -5 0 -10 Z'
            strokeWidth='1.8'
            strokeLinejoin='round'
            className='fill-drop stroke-tree-outline'
        />
        <ellipse cx='-2.5' cy='3' rx='1.6' ry='2.6' fillOpacity='0.75' className='fill-drop-shine' />
    </svg>
);
