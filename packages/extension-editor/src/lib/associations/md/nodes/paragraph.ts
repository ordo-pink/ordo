import { ParagraphNode } from "lexical"

export class CustomParagraphNode extends ParagraphNode {
  static override getType() {
    return "custom-paragraph"
  }

  constructor(__key?: string) {
    super(__key)
  }

  static override importJSON(): CustomParagraphNode {
    return new CustomParagraphNode()
  }

  static override clone(node: ParagraphNode) {
    return new CustomParagraphNode(node.__key)
  }

  override createDOM() {
    return document.createElement("div")
  }

  override exportJSON() {
    return { ...super.exportJSON(), type: "custom-paragraph" }
  }
}
