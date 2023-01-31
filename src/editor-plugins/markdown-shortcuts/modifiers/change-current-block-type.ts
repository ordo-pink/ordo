import { EditorState } from "draft-js"
import { merge } from "immutable"

export const changeCurrentBlockType = (
  editorState: EditorState,
  type: string,
  text: string,
  blockMetadata: Record<string, unknown> = {},
) => {
  const currentContent = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const blockMap = currentContent.getBlockMap()
  const block = blockMap.get(key)

  if (!block) {
    return editorState
  }

  const data = block.getData().merge(blockMetadata)
  const newBlock = merge(block, { type, data, text: text || "" })

  if (!newBlock) {
    return editorState
  }

  const newSelection = selection.merge({
    anchorOffset: 0,
    focusOffset: 0,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newContentStateMap = (currentContent as any).merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: newSelection,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return EditorState.push(editorState, newContentStateMap as any, "change-block-type")
}
