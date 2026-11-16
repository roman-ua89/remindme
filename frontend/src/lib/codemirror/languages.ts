import { javascript } from '@codemirror/lang-javascript';

export function getLanguageExtension(language: string) {
    if (language === 'typescript') {
        return javascript({ typescript: true });
    }

    return javascript();
}
