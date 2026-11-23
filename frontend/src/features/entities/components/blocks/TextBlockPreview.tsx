import { tiptapJsonToHtml } from '@/lib/tiptap/generate-html';
import { cn } from '@/lib/utils';

type TextBlockPreviewProps = {
    contentJson: Record<string, unknown>;
};

// Inline code (not inside <pre>) is a soft paper chip; typography's backtick pseudo-elements are switched off.
const inlineCodeClassName =
    '[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:border [&_:not(pre)>code]:border-block-text-chip-border [&_:not(pre)>code]:bg-block-text-chip [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-px [&_:not(pre)>code]:font-code [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:font-normal [&_:not(pre)>code]:text-foreground [&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none';

// Highlights (TipTap Highlight renders <mark>) use the same soft paper chip as inline code, instead of the browser's yellow.
const highlightClassName =
    '[&_mark]:rounded-md [&_mark]:border [&_mark]:border-block-text-chip-border [&_mark]:bg-block-text-chip [&_mark]:px-1.5 [&_mark]:py-px [&_mark]:text-foreground';

export const TextBlockPreview = ({ contentJson }: TextBlockPreviewProps) => {
    const html = tiptapJsonToHtml(contentJson);

    return (
        <div
            className={cn(
                'prose max-w-none text-[18px] leading-[1.65] text-foreground [--tw-prose-body:var(--foreground)] [--tw-prose-bold:var(--foreground)] [--tw-prose-headings:var(--foreground)] [--tw-prose-code:var(--foreground)]',
                inlineCodeClassName,
                highlightClassName,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
