export const WateringCan = ({ className }: { className?: string }) => (
    <svg
        width='132'
        height='101'
        viewBox='0 0 210 160'
        role='img'
        aria-label='Grey watering can with one drop falling from its spout'
        className={className}
    >
        <ellipse cx='142' cy='141' rx='44' ry='6' className='fill-tree-ground' />
        <g transform='translate(0 -48) rotate(-15 142 96)'>
            <g strokeLinejoin='round' strokeLinecap='round' className='stroke-tree-outline'>
                <path d='M170 74 C204 68 210 116 178 122' fill='none' strokeWidth='13' />
                <path d='M170 74 C204 68 210 116 178 122' fill='none' strokeWidth='7' className='stroke-watering-can' />
                <path d='M110 116 L20 50 L16 56 L108 126 Z' strokeWidth='3' className='fill-watering-can' />
                <path
                    d='M116 64 Q118 56 126 56 L158 56 Q166 56 168 64 L180 126 Q181 136 171 136 L113 136 Q103 136 104 126 Z'
                    strokeWidth='3'
                    className='fill-watering-can'
                />
                <ellipse cx='142' cy='58' rx='11' ry='3.5' strokeWidth='2' className='fill-watering-can-opening' />
            </g>
        </g>
        <g transform='translate(11 57)'>
            <path
                d='M0 -10 C3 -5 7 -1 7 4 A7 7 0 0 1 -7 4 C-7 -1 -3 -5 0 -10 Z'
                strokeWidth='2'
                strokeLinejoin='round'
                className='fill-drop stroke-tree-outline'
            />
            <ellipse cx='-2.5' cy='3' rx='1.6' ry='2.6' fillOpacity='0.75' className='fill-drop-shine' />
        </g>
    </svg>
);
