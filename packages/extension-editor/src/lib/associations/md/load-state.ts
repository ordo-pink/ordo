import { $convertFromMarkdownString, Transformer } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { Nullable } from "@ordo-pink/common-types"
import { useEffect } from "react"

type Props = {
  content: Nullable<string>
  transformers: Transformer[]
}

export const LoadEditorStatePlugin = ({ content, transformers }: Props) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor) return

    editor.update(() => {
      $convertFromMarkdownString(content ?? "\n   \n", transformers)
    })

    editor.focus()
  }, [editor, content, transformers])

  return null
}
