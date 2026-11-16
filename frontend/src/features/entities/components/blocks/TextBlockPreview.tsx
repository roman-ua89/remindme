import { tiptapJsonToHtml } from '@/lib/tiptap/generate-html';

type TextBlockPreviewProps = {
    contentJson: Record<string, unknown>;
};

export function TextBlockPreview({ contentJson }: TextBlockPreviewProps) {
    const html = tiptapJsonToHtml(contentJson);

    return <div className='prose prose-sm dark:prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: html }} />;
}
