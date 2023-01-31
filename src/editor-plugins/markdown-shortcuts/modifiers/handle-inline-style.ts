import { EditorState } from "draft-js"

import { changeCurrentInlineStyle } from "$editor-plugins/markdown-shortcuts/modifiers/change-current-inline-style"

const inlineMatchers: Record<string, RegExp> = {
  BOLD: /(?:^|\s|\n|[^A-z0-9_*~`])(\*{2}|_{2})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
  ITALIC: /(?:^|\s|\n|[^A-z0-9_*~`])(\*{1}|_{1})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
  CODE: /(?:^|\s|\n|[^A-z0-9_*~`])(`)((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
  STRIKETHROUGH: /(?:^|\s|\n|[^A-z0-9_*~`])(~{2})((?!\1).*?)(\1)($|\s|\n|[^A-z0-9_*~`])/g,
}

export const handleInlineStyle = (editorState: EditorState, character: string) => {
  const key = editorState.getSelection().getStartKey()
  const text = editorState.getCurrentContent().getBlockForKey(key).getText()
  const line = `${text}${character}`
  let newEditorState = editorState
  Object.keys(inlineMatchers).some((k) => {
    const re = inlineMatchers[k]
    let matchArr
    do {
      matchArr = re.exec(line)
      if (matchArr) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newEditorState = changeCurrentInlineStyle(newEditorState, matchArr, k as any)
      }
    } while (matchArr)
    return newEditorState !== editorState
  })
  return newEditorState
}
