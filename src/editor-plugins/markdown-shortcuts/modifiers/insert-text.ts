import { EditorState, Modifier } from "draft-js"

export const insertText = (editorState: EditorState, text: string) => {
  const selection = editorState.getSelection()
  const content = editorState.getCurrentContent()
  const newContentState = Modifier.insertText(
    content,
    selection,
    text,
    editorState.getCurrentInlineStyle(),
  )
  return EditorState.push(editorState, newContentState, "insert-fragment")
}
