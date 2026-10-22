export type { EntityListItem, EntityListPage, EntityMarker } from '@remindme/contracts/entities';

export type BlockType = 'text' | 'code' | 'image' | 'list';

export type CodeLanguage = 'javascript' | 'typescript';

export type CodeContentJson = {
    language: CodeLanguage;
    value: string;
    blurredByDefault: boolean;
};

export type ListBlockRow = {
    leftValue: string;
    rightValue: string;
};

export type ListBlockContentJson = {
    blurRightSideByDefault: boolean;
};

export type EntityBlockFormBase = {
    clientId: string;
    blockType: BlockType;
};

export type TextBlockForm = EntityBlockFormBase & {
    blockType: 'text';
    contentJson: Record<string, unknown>;
};

export type CodeBlockForm = EntityBlockFormBase & {
    blockType: 'code';
    contentJson: CodeContentJson;
};

export type ImageBlockForm = EntityBlockFormBase & {
    blockType: 'image';
    mediaAssetId: string;
    previewUrl?: string;
};

export type ListBlockForm = EntityBlockFormBase & {
    blockType: 'list';
    contentJson: ListBlockContentJson;
    rows: ListBlockRow[];
};

export type EntityBlockForm = TextBlockForm | CodeBlockForm | ImageBlockForm | ListBlockForm;

export type EntityConstructorFormValues = {
    title: string;
    blocks: EntityBlockForm[];
};

export type SaveEntityTextBlock = {
    blockType: 'text';
    position: number;
    contentJson: Record<string, unknown>;
};

export type SaveEntityCodeBlock = {
    blockType: 'code';
    position: number;
    contentJson: CodeContentJson;
};

export type SaveEntityImageBlock = {
    blockType: 'image';
    position: number;
    mediaAssetId: string;
};

export type SaveEntityListBlock = {
    blockType: 'list';
    position: number;
    contentJson: ListBlockContentJson;
    rows: ListBlockRow[];
};

export type SaveEntityBlock = SaveEntityTextBlock | SaveEntityCodeBlock | SaveEntityImageBlock | SaveEntityListBlock;

export type SaveEntityPayload = {
    title: string;
    blocks: SaveEntityBlock[];
};

export const MAX_ENTITY_BLOCKS = 20;
