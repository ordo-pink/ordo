import { EditorState, RichUtils } from "draft-js"
import { KeyboardEvent } from "react"

import { CheckableListItemUtils } from "$editor-plugins/checkable-list-items"

const adjustBlockDepth = (editorState: EditorState, ev: KeyboardEvent) => {
  const newEditorState = CheckableListItemUtils.onTab(ev, editorState, 4)
  if (newEditorState !== editorState) {
    return newEditorState
  }
  return RichUtils.onTab(ev, editorState, 4)
}

export default adjustBlockDepth
