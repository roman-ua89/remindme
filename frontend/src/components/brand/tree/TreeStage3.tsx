export const TreeStage3 = ({ className }: { className?: string }) => (
    <svg width='260' height='260' viewBox='0 0 320 320' role='img' aria-label='A thin sapling with its first two branches' className={className}>
        <ellipse cx='160' cy='293' rx='118' ry='13' className='fill-tree-ground' />
        <path
            d='M152 262 C154 230 156 196 157 150 L163 150 C164 196 166 230 168 262 Z'
            strokeWidth='3.5'
            strokeLinejoin='round'
            className='fill-tree-trunk stroke-tree-outline'
        />
        <path d='M158 204 C146 194 136 186 124 172' fill='none' strokeWidth='11' strokeLinecap='round' className='stroke-tree-outline' />
        <path d='M158 204 C146 194 136 186 124 172' fill='none' strokeWidth='5' strokeLinecap='round' className='stroke-tree-trunk' />
        <path d='M162 188 C174 178 184 170 196 158' fill='none' strokeWidth='11' strokeLinecap='round' className='stroke-tree-outline' />
        <path d='M162 188 C174 178 184 170 196 158' fill='none' strokeWidth='5' strokeLinecap='round' className='stroke-tree-trunk' />
        <g strokeWidth='3' strokeLinejoin='round' className='stroke-tree-outline'>
            <g transform='translate(124 172) rotate(-150) scale(1)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(124 172) rotate(-105) scale(1)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(196 158) rotate(-30) scale(1)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(196 158) rotate(-75) scale(1)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(160 152) rotate(-90) scale(1)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(160 152) rotate(-135) scale(1)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(160 152) rotate(-45) scale(1)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(157 224) rotate(-165) scale(0.8)'>
                <path d='M0 0 C10 -15 30 -15 38 0 C30 15 10 15 0 0 Z' className='fill-tree-leaf-light' />
                <path d='M5 0 H31' fill='none' strokeWidth='2' strokeLinecap='round' className='stroke-tree-leaf-vein' />
            </g>
            <g transform='translate(163 210) rotate(-15) scale(0.8)'>
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
