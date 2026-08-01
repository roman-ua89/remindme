import { saveEntitySchema } from '@/features/entities/schemas';
import type { EntityBlockForm, EntityConstructorFormValues, SaveEntityBlock, SaveEntityPayload } from '@/features/entities/types';

function toSaveBlock(block: EntityBlockForm, position: number): SaveEntityBlock {
    switch (block.blockType) {
        case 'text':
            return {
                blockType: 'text',
                position,
                contentJson: block.contentJson,
            };
        case 'code':
            return {
                blockType: 'code',
                position,
                contentJson: block.contentJson,
            };
        case 'image':
            return {
                blockType: 'image',
                position,
                mediaAssetId: block.mediaAssetId,
            };
        case 'list':
            return {
                blockType: 'list',
                position,
                contentJson: block.contentJson,
                rows: block.rows,
            };
    }
}

export function toSaveEntityPayload(values: EntityConstructorFormValues): SaveEntityPayload {
    const payload: SaveEntityPayload = {
        title: values.title.trim(),
        blocks: values.blocks.map((block, index) => toSaveBlock(block, index)),
    };

    return saveEntitySchema.parse(payload);
}
