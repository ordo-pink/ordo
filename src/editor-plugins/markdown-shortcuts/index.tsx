import { ContentBlock, EditorState } from "draft-js"
import { Map } from "immutable"
import { KeyboardEvent } from "react"

import createImageDecorator from "./decorators/image"
import createLinkDecorator from "./decorators/link"
import adjustBlockDepth from "./modifiers/adjust-block-depth"
import { changeCurrentBlockType } from "./modifiers/change-current-block-type"
import handleBlockType from "./modifiers/handle-block-type"
import handleImage from "./modifiers/handle-image"
import handleInlineStyle from "./modifiers/handle-inline-style"
import handleLink from "./modifiers/handle-link"
import handleNewCodeBlock from "./modifiers/handle-new-code-block"
import insertEmptyBlock from "./modifiers/insert-empty-block"
import insertText from "./modifiers/insert-text"
import leaveList from "./modifiers/leave-list"
import { replaceText } from "./utils"
import {
  blockRenderMap as checkboxBlockRenderMap,
  CheckableListItem,
  CheckableListItemUtils,
  CHECKABLE_LIST_ITEM,
} from "$editor-plugins/checkable-list-items"

function checkCharacterForState(editorState: EditorState, character: string) {
  let newEditorState = handleBlockType(editorState, character)
  const contentState = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const currentBlock = contentState.getBlockForKey(key)
  const type = currentBlock.getType()
  if (editorState === newEditorState) {
    newEditorState = handleImage(editorState, character)
  }
  if (editorState === newEditorState) {
    newEditorState = handleLink(editorState, character)
  }
  if (editorState === newEditorState && type !== "code-block") {
    newEditorState = handleInlineStyle(editorState, character)
  }
  return newEditorState
}

function checkReturnForState(
  editorState: EditorState,
  ev: KeyboardEvent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { insertEmptyBlockOnReturnWithModifierKey }: any,
) {
  let newEditorState = editorState
  const contentState = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const key = selection.getStartKey()
  const currentBlock = contentState.getBlockForKey(key)
  const type = currentBlock.getType()
  const text = currentBlock.getText()
  if (/-list-item$/.test(type) && text === "") {
    newEditorState = leaveList(editorState)
  }
  if (
    newEditorState === editorState &&
    insertEmptyBlockOnReturnWithModifierKey &&
    (ev.ctrlKey ||
      ev.shiftKey ||
      ev.metaKey ||
      ev.altKey ||
      (/^header-/.test(type) &&
        selection.isCollapsed() &&
        selection.getEndOffset() === text.length))
  ) {
    newEditorState = insertEmptyBlock(editorState)
  }
  if (newEditorState === editorState && type !== "code-block" && /^```([\w-]+)?$/.test(text)) {
    newEditorState = handleNewCodeBlock(editorState)
  }
  if (newEditorState === editorState && type === "code-block") {
    if (/```\s*$/.test(text)) {
      newEditorState = changeCurrentBlockType(newEditorState, type, text.replace(/\n```\s*$/, ""))
      newEditorState = insertEmptyBlock(newEditorState)
    } else {
      newEditorState = insertText(editorState, "\n")
    }
  }
  if (editorState === newEditorState) {
    newEditorState = handleInlineStyle(editorState, "\n")
  }
  return newEditorState
}

const createMarkdownShortcutsPlugin = (
  config = { insertEmptyBlockOnReturnWithModifierKey: true },
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store: any = {}
  return {
    store,
    blockRenderMap: Map({
      "code-block": {
        element: "code",
        wrapper: <pre spellCheck="false" />,
      },
    }).merge(checkboxBlockRenderMap),
    decorators: [createLinkDecorator(), createImageDecorator()],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialize({ setEditorState, getEditorState }: any) {
      store.setEditorState = setEditorState
      store.getEditorState = getEditorState
    },
    blockStyleFn(block: ContentBlock) {
      switch (block.getType()) {
        case CHECKABLE_LIST_ITEM:
          return CHECKABLE_LIST_ITEM
        default:
          break
      }
      return null
    },

    blockRendererFn(block: ContentBlock) {
      switch (block.getType()) {
        case CHECKABLE_LIST_ITEM: {
          return {
            component: CheckableListItem,
            props: {
              onChangeChecked: () =>
                store.setEditorState(
                  CheckableListItemUtils.toggleChecked(store.getEditorState(), block),
                ),
              checked: !!block.getData().get("checked"),
            },
          }
        }
        default:
          return null
      }
    },
    onTab(ev: KeyboardEvent) {
      const editorState = store.getEditorState()
      const newEditorState = adjustBlockDepth(editorState, ev)
      if (newEditorState !== editorState) {
        store.setEditorState(newEditorState)
        return "handled"
      }
      return "not-handled"
    },
    handleReturn(ev: KeyboardEvent, editorState: EditorState) {
      const newEditorState = checkReturnForState(editorState, ev, config)
      if (editorState !== newEditorState) {
        store.setEditorState(newEditorState)
        return "handled"
      }
      return "not-handled"
    },
    handleBeforeInput(character: string, editorState: EditorState) {
      if (character.match(/[A-z0-9_*~`]/)) {
        return "not-handled"
      }
      const newEditorState = checkCharacterForState(editorState, character)
      if (editorState !== newEditorState) {
        store.setEditorState(newEditorState)
        return "handled"
      }
      return "not-handled"
    },
    handlePastedText(text: string, html: string, editorState: EditorState) {
      if (html) {
        return "not-handled"
      }

      if (!text) {
        return "not-handled"
      }

      let newEditorState = editorState
      let buffer = []
      for (let i = 0; i < text.length; i += 1) {
        // eslint-disable-line no-plusplus
        if (text[i].match(/[^A-z0-9_*~`]/)) {
          newEditorState = replaceText(newEditorState, buffer.join("") + text[i])
          newEditorState = checkCharacterForState(newEditorState, text[i])
          buffer = []
        } else if (text[i].charCodeAt(0) === 10) {
          newEditorState = replaceText(newEditorState, buffer.join(""))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tmpEditorState = checkReturnForState(newEditorState, {} as any, config)
          if (newEditorState === tmpEditorState) {
            newEditorState = insertEmptyBlock(tmpEditorState)
          } else {
            newEditorState = tmpEditorState
          }
          buffer = []
        } else if (i === text.length - 1) {
          newEditorState = replaceText(newEditorState, buffer.join("") + text[i])
          buffer = []
        } else {
          buffer.push(text[i])
        }
      }

      if (editorState !== newEditorState) {
        store.setEditorState(newEditorState)
        return "handled"
      }
      return "not-handled"
    },
  }
}

export default createMarkdownShortcutsPlugin
