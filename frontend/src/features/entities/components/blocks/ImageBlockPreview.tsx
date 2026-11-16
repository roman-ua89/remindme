type ImageBlockPreviewProps = {
    previewUrl?: string;
};

export function ImageBlockPreview({ previewUrl }: ImageBlockPreviewProps) {
    if (!previewUrl) {
        return <p className='text-sm text-muted-foreground'>Image unavailable</p>;
    }

    return (
        <div className='overflow-hidden rounded-md border border-input bg-muted/30'>
            <img src={previewUrl} alt='Entity image' className='max-h-64 w-full object-contain' />
        </div>
    );
}
