import { ExternalLinkIcon } from 'lucide-react';

import type { LinkContentJson } from '@/features/entities/types';

type LinkBlockPreviewProps = {
    contentJson: LinkContentJson;
};

export const LinkBlockPreview = ({ contentJson }: LinkBlockPreviewProps) => {
    const title = contentJson.title.trim();

    return (
        <div className='flex flex-col gap-1'>
            {title ? <p className='text-sm font-medium'>{title}</p> : null}
            <a
                href={contentJson.url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex w-fit items-center gap-1 text-sm text-primary underline-offset-4 hover:underline break-all'
            >
                {contentJson.url}
                <ExternalLinkIcon className='size-4 shrink-0' aria-hidden='true' />
            </a>
        </div>
    );
};
