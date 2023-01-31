import { EditorState, RichUtils } from "draft-js"

export const leaveList = (editorState: EditorState) => {
  const contentState = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const currentBlock = contentState.getBlockForKey(key)
  const type = currentBlock.getType()
  return RichUtils.toggleBlockType(editorState, type)
}
