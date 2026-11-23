import { useEffect } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import type { Control, FieldPath } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { AlignCenter, AlignLeft, Bold, Heading1, Heading2, Heading3, Highlighter, Italic, Pilcrow, Strikethrough } from 'lucide-react';

import type { EntityConstructorFormValues } from '@/features/entities/types';
import { tiptapExtensions } from '@/lib/tiptap/extensions';
import { Button } from '#/components/ui/button.tsx';

type TextBlockEditorProps = {
    control: Control<EntityConstructorFormValues>;
    name: FieldPath<EntityConstructorFormValues>;
};

export function TextBlockEditor({ control, name }: TextBlockEditorProps) {
    return (
        <Controller control={control} name={name} render={({ field }) => <TextBlockEditorInner value={field.value} onChange={field.onChange} />} />
    );
}

type TextBlockEditorInnerProps = {
    value: unknown;
    onChange: (value: Record<string, unknown>) => void;
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const editorState = useEditorState({
        editor,
        selector: (context) => {
            return {
                isBold: context.editor?.isActive('bold') ?? false,
                isItalic: context.editor?.isActive('italic') ?? false,
                isStrike: context.editor?.isActive('strike') ?? false,
                isHighlight: context.editor?.isActive('highlight') ?? false,
                isAlignLeft: context.editor?.isActive({ textAlign: 'left' }) ?? false,
                isAlignCenter: context.editor?.isActive({ textAlign: 'center' }) ?? false,
                isParagraph: context.editor?.isActive('paragraph') ?? false,
                isHeading1: context.editor?.isActive('heading', { level: 1 }) ?? false,
                isHeading2: context.editor?.isActive('heading', { level: 2 }) ?? false,
                isHeading3: context.editor?.isActive('heading', { level: 3 }) ?? false,
            };
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className='flex flex-wrap gap-2 mb-3'>
            <Button
                type='button'
                variant={editorState?.isBold ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                size='icon-sm'
                aria-label='Bold'
                title='Bold'
                aria-pressed={editorState?.isBold}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className='size-4' />
            </Button>
            <Button
                type='button'
                variant={editorState?.isItalic ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                size='icon-sm'
                aria-label='Italic'
                title='Italic'
                aria-pressed={editorState?.isItalic}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className='size-4' />
            </Button>
            <Button
                type='button'
                variant={editorState?.isStrike ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                size='icon-sm'
                aria-label='Strikethrough'
                title='Strikethrough'
                aria-pressed={editorState?.isStrike}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className='size-4' />
            </Button>
            <Button
                variant={editorState?.isHighlight ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                type='button'
                size='icon-sm'
                aria-label='Highlight'
                title='Highlight'
                aria-pressed={editorState?.isHighlight}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
                <Highlighter className='size-4' />
            </Button>
            <Button
                variant={editorState?.isAlignLeft ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                type='button'
                size='icon-sm'
                aria-label='Align left'
                title='Align left'
                aria-pressed={editorState?.isAlignLeft}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
                <AlignLeft className='size-4' />
            </Button>
            <Button
                variant={editorState?.isAlignCenter ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                type='button'
                size='icon-sm'
                aria-label='Align center'
                title='Align center'
                aria-pressed={editorState?.isAlignCenter}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
                <AlignCenter className='size-4' />
            </Button>
            <Button
                variant={editorState?.isHeading1 ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                type='button'
                size='icon-sm'
                aria-label='Heading 1'
                title='Heading 1'
                aria-pressed={editorState?.isHeading1}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <Heading1 className='size-4' />
            </Button>
            <Button
                variant={editorState?.isHeading2 ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                type='button'
                size='icon-sm'
                aria-label='Heading 2'
                title='Heading 2'
                aria-pressed={editorState?.isHeading2}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className='size-4' />
            </Button>
            <Button
                variant={editorState?.isHeading3 ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                type='button'
                size='icon-sm'
                aria-label='Heading 3'
                title='Heading 3'
                aria-pressed={editorState?.isHeading3}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <Heading3 className='size-4' />
            </Button>
            <Button
                variant={editorState?.isParagraph ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                type='button'
                size='icon-sm'
                aria-label='Paragraph'
                title='Paragraph'
                aria-pressed={editorState?.isParagraph}
                onClick={() => editor.chain().focus().setParagraph().run()}
            >
                <Pilcrow className='size-4' />
            </Button>
        </div>
    );
};

function TextBlockEditorInner({ value, onChange }: TextBlockEditorInnerProps) {
    const editor = useEditor({
        extensions: [
            ...tiptapExtensions,
            Highlight,
            TextAlign,
            TextAlign.configure({
                types: ['paragraph', 'heading'],
            }),
        ],
        content: value ?? {
            type: 'doc',
            content: [{ type: 'paragraph' }],
        },
        onUpdate: ({ editor: currentEditor }) => {
            onChange(currentEditor.getJSON() as Record<string, unknown>);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none min-h-24 rounded-md border border-input bg-background px-3 py-2 outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
            },
        },
    });

    useEffect(() => {
        const currentContent = JSON.stringify(editor.getJSON());
        const nextContent = JSON.stringify(value ?? null);

        if (currentContent !== nextContent) {
            editor.commands.setContent(
                value ?? {
                    type: 'doc',
                    content: [{ type: 'paragraph' }],
                },
            );
        }
    }, [editor, value]);

    return (
        <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </>
    );
}
