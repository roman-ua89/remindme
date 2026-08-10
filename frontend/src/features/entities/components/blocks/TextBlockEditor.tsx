import { useEffect } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import type { Control, FieldPath } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import Highlight from '@tiptap/extension-highlight';

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
            };
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className='flex gap-2 mb-3'>
            <Button
                type='button'
                variant={editorState?.isBold ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                size='sm'
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                Bold
            </Button>
            <Button
                type='button'
                variant={editorState?.isItalic ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                size='sm'
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                Italic
            </Button>
            <Button
                type='button'
                variant={editorState?.isStrike ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                size='sm'
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                Strike
            </Button>
            <Button
                type='button'
                variant={editorState?.isHighlight ? 'selectedEditorBtn' : 'defaultEditorBtn'}
                size='sm'
                onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
                Highlight
            </Button>
        </div>
    );
};

function TextBlockEditorInner({ value, onChange }: TextBlockEditorInnerProps) {
    const editor = useEditor({
        extensions: [...tiptapExtensions, Highlight],
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
