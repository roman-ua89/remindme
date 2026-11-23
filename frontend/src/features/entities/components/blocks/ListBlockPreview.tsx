import { useState } from 'react';

import type { ListBlockContentJson, ListBlockRow } from '@/features/entities/types';

type ListBlockPreviewProps = {
    rows: ListBlockRow[];
    contentJson: ListBlockContentJson;
};

type ListRowPreviewProps = {
    row: ListBlockRow;
    blurRightSideByDefault: boolean;
};

const ListRowPreview = ({ row, blurRightSideByDefault }: ListRowPreviewProps) => {
    const [revealed, setRevealed] = useState(false);
    const isBlurred = blurRightSideByDefault && !revealed;

    return (
        <tr className='border-b border-block-table-border last:border-b-0'>
            <td className='w-1/2 px-4 py-3 align-top'>{row.leftValue || ' '}</td>
            <td className='w-1/2 px-4 py-3 align-top'>
                <span
                    className={isBlurred ? 'cursor-pointer select-none blur-sm' : undefined}
                    onClick={() => {
                        if (blurRightSideByDefault) {
                            setRevealed((current) => !current);
                        }
                    }}
                    onKeyDown={(event) => {
                        if (!blurRightSideByDefault) {
                            return;
                        }

                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setRevealed((current) => !current);
                        }
                    }}
                    role={blurRightSideByDefault ? 'button' : undefined}
                    tabIndex={blurRightSideByDefault ? 0 : undefined}
                >
                    {row.rightValue || ' '}
                </span>
            </td>
        </tr>
    );
};

export const ListBlockPreview = ({ rows, contentJson }: ListBlockPreviewProps) => {
    const { blurRightSideByDefault } = contentJson;

    return (
        <div className='overflow-hidden rounded-xl border border-block-table-border'>
            <table className='w-full table-fixed border-collapse text-base leading-6'>
                <tbody>
                    {rows.map((row, index) => (
                        <ListRowPreview key={index} row={row} blurRightSideByDefault={blurRightSideByDefault} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
