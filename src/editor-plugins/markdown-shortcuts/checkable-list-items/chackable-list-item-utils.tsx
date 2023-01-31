import { ContentBlock, EditorState } from "draft-js"
import { adjustBlockDepth, mergeBlockDataByKey } from "draft-js-modifiers"
import { KeyboardEvent } from "react"

import CheckableListItem from "$editor-plugins/markdown-shortcuts/checkable-list-items/checkable-list-item"
import {
  CHECKABLE_LIST_ITEM,
  UNORDERED_LIST_ITEM,
  ORDERED_LIST_ITEM,
} from "$editor-plugins/markdown-shortcuts/checkable-list-items/constants"

export type CheckableListItemBlock = {
  component: typeof CheckableListItem
  props: Record<string, unknown>
}

export default class CheckableListItemUtils {
  static toggleChecked(editorState: EditorState, block: ContentBlock): EditorState {
    return mergeBlockDataByKey(editorState, block.getKey(), {
      checked: !block.getData().get("checked"),
    })
  }

  // https://github.com/facebook/draft-js/blob/0.10-stable/src/model/modifier/RichTextEditorUtil.js#L190
  static onTab(
    event: KeyboardEvent<EventTarget>,
    editorState: EditorState,
    maxDepth: number,
  ): EditorState {
    const selection = editorState.getSelection()
    const key = selection.getAnchorKey()
    if (key !== selection.getFocusKey()) {
      return editorState
    }

    const content = editorState.getCurrentContent()
    const block = content.getBlockForKey(key)
    const type = block.getType()
    if (
      type !== UNORDERED_LIST_ITEM &&
      type !== ORDERED_LIST_ITEM &&
      type !== CHECKABLE_LIST_ITEM
    ) {
      return editorState
    }

    event.preventDefault()

    // Only allow indenting one level beyond the block above, and only if
    // the block above is a list item as well.
    const blockAbove = content.getBlockBefore(key)
    if (!blockAbove) {
      return editorState
    }

    const typeAbove = blockAbove.getType()
    if (
      typeAbove !== UNORDERED_LIST_ITEM &&
      typeAbove !== ORDERED_LIST_ITEM &&
      typeAbove !== CHECKABLE_LIST_ITEM
    ) {
      return editorState
    }

    const depth = block.getDepth()
    if (!event.shiftKey && depth === maxDepth) {
      return editorState
    }

    maxDepth = Math.min(blockAbove.getDepth() + 1, maxDepth)

    return adjustBlockDepth(editorState, event.shiftKey ? -1 : 1, maxDepth)
  }
}
