import { EditorState, RichUtils } from "draft-js"

import { CHECKABLE_LIST_ITEM } from "$editor-plugins/checkable-list-items"
import { changeCurrentBlockType } from "$editor-plugins/markdown-shortcuts/modifiers/change-current-block-type"

const sharps = (len: number) => {
  let ret = ""
  while (ret.length < len) {
    ret += "#"
  }
  return ret
}

const blockTypes = [
  null,
  "header-one",
  "header-two",
  "header-three",
  "header-four",
  "header-five",
  "header-six",
]

const handleBlockType = (editorState: EditorState, character: string) => {
  const currentSelection = editorState.getSelection()
  const key = currentSelection.getStartKey()
  const text = editorState.getCurrentContent().getBlockForKey(key).getText()
  const position = currentSelection.getAnchorOffset()
  const line = [text.slice(0, position), character, text.slice(position)].join("")
  const blockType = RichUtils.getCurrentBlockType(editorState)
  for (let i = 1; i <= 6; i += 1) {
    if (line.indexOf(`${sharps(i)} `) === 0 && blockType !== "code-block") {
      return changeCurrentBlockType(editorState, blockTypes[i] as string, line.replace(/^#+\s/, ""))
    }
  }
  let matchArr = line.match(/^[*-] (.*)$/)
  if (matchArr) {
    return changeCurrentBlockType(editorState, "unordered-list-item", matchArr[1])
  }
  matchArr = line.match(/^[\d]\. (.*)$/)
  if (matchArr) {
    return changeCurrentBlockType(editorState, "ordered-list-item", matchArr[1])
  }
  matchArr = line.match(/^> (.*)$/)
  if (matchArr) {
    return changeCurrentBlockType(editorState, "blockquote", matchArr[1])
  }
  matchArr = line.match(/^\[([x ])] (.*)$/i)
  if (matchArr && blockType === "unordered-list-item") {
    return changeCurrentBlockType(editorState, CHECKABLE_LIST_ITEM, matchArr[2], {
      checked: matchArr[1] !== " ",
    })
  }
  return editorState
}

export default handleBlockType
