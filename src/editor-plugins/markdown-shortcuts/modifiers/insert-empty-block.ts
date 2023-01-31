import { genKey, ContentBlock, EditorState } from "draft-js"
import Immutable, { List, Map } from "immutable"

export const insertEmptyBlock = (
  editorState: EditorState,
  blockType = "unstyled",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Immutable.Map<any, any> = Immutable.Map({}),
) => {
  const contentState = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const currentBlock = contentState.getBlockForKey(key)
  const emptyBlockKey = genKey()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emptyBlock = new (ContentBlock as any)({
    characterList: List(),
    depth: 0,
    key: emptyBlockKey,
    text: "",
    type: blockType,
    data: Map().merge(data),
  })

  const blockMap = contentState.getBlockMap()
  const blocksBefore = blockMap.toSeq().takeUntil((value) => value === currentBlock)
  const blocksAfter = blockMap
    .toSeq()
    .skipUntil((value) => value === currentBlock)
    .rest()
  const augmentedBlocks = [
    [currentBlock.getKey(), currentBlock],
    [emptyBlockKey, emptyBlock],
  ]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newBlocks = blocksBefore.concat(augmentedBlocks as any, blocksAfter).toOrderedMap()
  const focusKey = emptyBlockKey
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newContentState = (contentState as any).merge({
    blockMap: newBlocks,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: focusKey,
      anchorOffset: 0,
      focusKey,
      focusOffset: 0,
      isBackward: false,
    }),
  })
  return EditorState.push(editorState, newContentState, "split-block")
}
