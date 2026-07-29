import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { Control, FieldPath } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { EntityConstructorFormValues } from '@/features/entities/types';
import { tiptapExtensions } from '@/lib/tiptap/extensions';

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

function TextBlockEditorInner({ value, onChange }: TextBlockEditorInnerProps) {
    const editor = useEditor({
        extensions: tiptapExtensions,
        content: (value as Record<string, unknown>) ?? {
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
        if (!editor) return;

        const currentContent = JSON.stringify(editor.getJSON());
        const nextContent = JSON.stringify(value ?? null);

        if (currentContent !== nextContent) {
            editor.commands.setContent(
                (value as Record<string, unknown>) ?? {
                    type: 'doc',
                    content: [{ type: 'paragraph' }],
                },
            );
        }
    }, [editor, value]);

    return <EditorContent editor={editor} />;
}
