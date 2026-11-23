import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { EditorView } from '@uiw/react-codemirror';

// Read-only code preview on a lavender panel: transparent editor, syntax colours from the index.css tokens.
const previewTheme = EditorView.theme({
    '&': {
        fontSize: '15px',
        color: 'var(--foreground)',
        backgroundColor: 'transparent',
    },
    '.cm-scroller': {
        fontFamily: 'var(--code-font)',
        lineHeight: '1.6',
    },
    '.cm-content': {
        padding: '12px 0',
    },
    '.cm-gutters': {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'var(--muted-foreground)',
    },
    '.cm-activeLine, .cm-activeLineGutter': {
        backgroundColor: 'transparent',
    },
});

const previewHighlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: 'var(--syntax-keyword)' },
    { tag: [tags.string, tags.special(tags.string)], color: 'var(--syntax-string)' },
    { tag: [tags.number, tags.bool, tags.null], color: 'var(--syntax-number)' },
    { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--syntax-function)' },
    { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--syntax-comment)' },
]);

export const codePreviewExtensions = [previewTheme, syntaxHighlighting(previewHighlightStyle)];
