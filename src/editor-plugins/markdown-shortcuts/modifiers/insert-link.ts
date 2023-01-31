import { EditorState, RichUtils, SelectionState, Modifier } from "draft-js"

export const insertLink = (editorState: EditorState, matchArr: RegExpExecArray) => {
  const currentContent = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const [matchText, text, href, title] = matchArr
  const { index } = matchArr
  const focusOffset = index + matchText.length
  const wordSelection = SelectionState.createEmpty(key).merge({
    anchorOffset: index,
    focusOffset,
  })
  const nextContent = currentContent.createEntity("LINK", "MUTABLE", { href, title })
  const entityKey = nextContent.getLastCreatedEntityKey()
  let newContentState = Modifier.replaceText(nextContent, wordSelection, text, undefined, entityKey)
  newContentState = Modifier.insertText(newContentState, newContentState.getSelectionAfter(), " ")
  const newWordSelection = wordSelection.merge({
    focusOffset: index + text.length,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let newEditorState = EditorState.push(editorState, newContentState, "insert-link" as any)
  newEditorState = RichUtils.toggleLink(newEditorState, newWordSelection, entityKey)

  return EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter())
}
