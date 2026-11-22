export const TreeStage2 = ({ className }: { className?: string }) => (
    <svg width='260' height='260' viewBox='0 0 320 320' role='img' aria-label='A taller seedling with five leaves' className={className}>
        <ellipse cx='160' cy='293' rx='118' ry='13' className='fill-tree-ground' />
        <path d='M160 262 C158 238 162 214 160 186' fill='none' strokeWidth='13' strokeLinecap='round' className='stroke-tree-outline' />
        <path d='M160 262 C158 238 162 214 160 186' fill='none' strokeWidth='6' strokeLinecap='round' className='stroke-tree-trunk' />
        <g strokeWidth='3' strokeLinejoin='round' className='stroke-tree-outline'>
            <g transform='translate(160 188) rotate(-90) scale(1.0)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(160 190) rotate(-140) scale(0.95)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(160 190) rotate(-40) scale(0.95)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(159 226) rotate(-165) scale(0.85)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(161 214) rotate(-15) scale(0.85)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
        </g>
        <path
            d='M98 290 C110 264 136 256 160 256 C184 256 210 264 222 290 Z'
            strokeWidth='4'
            strokeLinejoin='round'
            className='fill-tree-soil stroke-tree-outline'
        />
        <g className='fill-tree-soil-dark'>
            <circle cx='130' cy='276' r='3.5' />
            <circle cx='186' cy='270' r='3' />
            <circle cx='152' cy='282' r='2.5' />
            <circle cx='200' cy='283' r='2.5' />
        </g>
        <ellipse cx='172' cy='281' rx='6' ry='3.5' className='fill-tree-pebble' />
        <ellipse cx='117' cy='285' rx='4' ry='2.5' className='fill-tree-pebble' />
    </svg>
);
