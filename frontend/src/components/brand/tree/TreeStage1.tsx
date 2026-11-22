export const TreeStage1 = ({ className }: { className?: string }) => (
    <svg width='260' height='260' viewBox='0 0 320 320' role='img' aria-label='A tiny sprout with two leaves' className={className}>
        <ellipse cx='160' cy='293' rx='118' ry='13' className='fill-tree-ground' />
        <path d='M160 262 C160 250 159 238 160 226' fill='none' strokeWidth='11' strokeLinecap='round' className='stroke-tree-outline' />
        <path d='M160 262 C160 250 159 238 160 226' fill='none' strokeWidth='5' strokeLinecap='round' className='stroke-tree-trunk' />
        <g strokeWidth='3' strokeLinejoin='round' className='stroke-tree-outline'>
            <g transform='translate(160 228) rotate(-155) scale(1.05)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(160 226) rotate(-25) scale(1.05)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
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
