import { EditorState, SelectionState, Modifier } from "draft-js"
import { OrderedSet } from "immutable"

const changeCurrentInlineStyle = (
  editorState: EditorState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matchArr: any,
  style: OrderedSet<unknown>,
) => {
  const currentContent = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const { index } = matchArr

  const blockMap = currentContent.getBlockMap()
  const block = blockMap.get(key)

  if (!block) {
    return editorState
  }
  const currentInlineStyle = block.getInlineStyleAt(index).merge()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newStyle = currentInlineStyle.merge([style]) as any
  const focusOffset = index + matchArr[0].length
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index + matchArr[0].indexOf(matchArr[1]),
    focusOffset,
  })
  let newContentState = Modifier.replaceText(currentContent, wordSelection, matchArr[2], newStyle)
  newContentState = Modifier.insertText(
    newContentState,
    newContentState.getSelectionAfter(),
    matchArr[4],
  )
  const newEditorState = EditorState.push(editorState, newContentState, "change-inline-style")
  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter())
}

export default changeCurrentInlineStyle
