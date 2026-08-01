import type {
  BlockType,
  EntityBlockForm,
  ListBlockRow,
} from '@/features/entities/types'

function createClientId() {
  return crypto.randomUUID()
}

const emptyTipTapDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

export function createBlock(blockType: BlockType): EntityBlockForm {
  const clientId = createClientId()

  switch (blockType) {
    case 'text':
      return {
        clientId,
        blockType: 'text',
        contentJson: emptyTipTapDoc,
      }
    case 'code':
      return {
        clientId,
        blockType: 'code',
        contentJson: {
          language: 'javascript',
          value: '',
        },
      }
    case 'image':
      return {
        clientId,
        blockType: 'image',
        mediaAssetId: '',
      }
    case 'list':
      return {
        clientId,
        blockType: 'list',
        contentJson: {
          showOneLineAtATime: false,
          blurRightSideByDefault: false,
        },
        rows: [createEmptyListRow()],
      }
  }
}

export function createEmptyListRow(): ListBlockRow {
  return {
    leftValue: '',
    rightValue: '',
  }
}
