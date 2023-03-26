import { $convertFromMarkdownString, Transformer } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { IOrdoFile } from "@ordo-pink/common-types"
import { useFileContentText } from "@ordo-pink/react-utils"
import { useEffect } from "react"

type Props = {
  file: IOrdoFile
  transformers: Transformer[]
}

export const LoadEditorStatePlugin = ({ file, transformers }: Props) => {
  const [editor] = useLexicalComposerContext()
  const content = useFileContentText(file)

  useEffect(() => {
    if (!editor || !content) return

    editor.update(() => {
      $convertFromMarkdownString(content, transformers)
    })

    editor.focus()
  }, [editor, file, file.path, content, transformers])

  return null
}
