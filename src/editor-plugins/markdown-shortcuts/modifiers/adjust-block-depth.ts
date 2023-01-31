import { EditorState, RichUtils } from "draft-js"
import { KeyboardEvent } from "react"

import CheckableListItemUtils from "$editor-plugins/markdown-shortcuts/checkable-list-items/chackable-list-item-utils"

export const adjustBlockDepth = (editorState: EditorState, ev: KeyboardEvent) => {
  const newEditorState = CheckableListItemUtils.onTab(ev, editorState, 4)
  if (newEditorState !== editorState) {
    return newEditorState
  }

  return RichUtils.onTab(ev, editorState, 4)
}
