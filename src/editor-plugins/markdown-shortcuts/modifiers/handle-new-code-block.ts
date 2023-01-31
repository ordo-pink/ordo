import { EditorState } from "draft-js"

import { changeCurrentBlockType } from "$editor-plugins/markdown-shortcuts/modifiers/change-current-block-type"
import { insertEmptyBlock } from "$editor-plugins/markdown-shortcuts/modifiers/insert-empty-block"

export const handleNewCodeBlock = (editorState: EditorState) => {
  const contentState = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const currentBlock = contentState.getBlockForKey(key)
  const matchData = /^```([\w-]+)?$/.exec(currentBlock.getText())
  const isLast = selection.getEndOffset() === currentBlock.getLength()
  if (matchData && isLast) {
    const data = {}
    const language = matchData[1]
    if (language) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(data as any).language = language
    }
    return changeCurrentBlockType(editorState, "code-block", "", data)
  }
  const type = currentBlock.getType()
  if (type === "code-block" && isLast) {
    return insertEmptyBlock(editorState, "code-block", currentBlock.getData())
  }
  return editorState
}
