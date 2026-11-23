import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';

import type { CodeContentJson } from '@/features/entities/types';
import { getLanguageExtension } from '@/lib/codemirror/languages';
import { codePreviewExtensions } from '@/lib/codemirror/preview-theme';

const languageLabels: Record<CodeContentJson['language'], string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
};

type CodeBlockPreviewProps = {
    contentJson: CodeContentJson;
};

export const CodeBlockPreview = ({ contentJson }: CodeBlockPreviewProps) => {
    const [revealed, setRevealed] = useState(false);
    const { blurredByDefault, language, value } = contentJson;
    const isBlurred = blurredByDefault && !revealed;

    return (
        <div className='overflow-hidden rounded-xl border border-block-code-border bg-block-code-surface'>
            <div className='flex items-center justify-between gap-4 border-b border-block-code-border bg-block-code-soft px-4 py-2.5'>
                <span className='text-sm font-semibold text-block-code'>{languageLabels[language]}</span>
                {isBlurred ? <span className='text-sm text-muted-foreground'>Hidden until you reveal it</span> : null}
            </div>

            <div className='relative'>
                <div className={isBlurred ? 'pointer-events-none select-none blur-sm' : undefined}>
                    <CodeMirror
                        value={value}
                        editable={false}
                        theme='none'
                        extensions={[getLanguageExtension(language), codePreviewExtensions]}
                        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false, highlightActiveLineGutter: false }}
                    />
                </div>

                {isBlurred ? (
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <button
                            type='button'
                            onClick={() => setRevealed(true)}
                            className='rounded-full border border-block-code-border bg-card px-5 py-2.5 text-sm font-semibold text-block-code transition-colors outline-none hover:bg-block-code-soft focus-visible:ring-3 focus-visible:ring-ring/50'
                        >
                            Show code
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
