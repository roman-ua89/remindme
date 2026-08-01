import { generateHTML } from '@tiptap/html'

import { tiptapExtensions } from '@/lib/tiptap/extensions'

export function tiptapJsonToHtml(contentJson: Record<string, unknown>) {
  return generateHTML(contentJson, tiptapExtensions)
}
