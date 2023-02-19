import { Nullable } from "@ordo-pink/common-types"

export const positionEditorElement = (editor: HTMLDivElement, rect: Nullable<DOMRect>) => {
  if (rect === null) {
    editor.style.opacity = "0"
    editor.style.top = "-1000px"
    editor.style.left = "-1000px"
  } else {
    editor.style.opacity = "1"
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`
  }
}
