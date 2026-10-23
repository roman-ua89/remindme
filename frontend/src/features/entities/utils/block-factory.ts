import type { BlockType, EntityBlockForm, ListBlockRow } from '@/features/entities/types';

function createClientId() {
    return crypto.randomUUID();
}

const emptyTipTapDoc = {
    type: 'doc',
    content: [{ type: 'paragraph' }],
};

export function createBlock(blockType: BlockType): EntityBlockForm {
    const clientId = createClientId();

    switch (blockType) {
        case 'text':
            return {
                clientId,
                blockType: 'text',
                contentJson: emptyTipTapDoc,
            };
        case 'code':
            return {
                clientId,
                blockType: 'code',
                contentJson: {
                    language: 'javascript',
                    value: '',
                    blurredByDefault: false,
                },
            };
        case 'image':
            return {
                clientId,
                blockType: 'image',
                mediaAssetId: '',
            };
        case 'list':
            return {
                clientId,
                blockType: 'list',
                contentJson: {
                    blurRightSideByDefault: false,
                },
                rows: [createEmptyListRow()],
            };
        case 'link':
            return {
                clientId,
                blockType: 'link',
                contentJson: {
                    title: '',
                    url: '',
                },
            };
    }
}

export function createEmptyListRow(): ListBlockRow {
    return {
        leftValue: '',
        rightValue: '',
    };
}
