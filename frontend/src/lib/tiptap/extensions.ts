import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

export const tiptapExtensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
    }),
    Underline,
];
