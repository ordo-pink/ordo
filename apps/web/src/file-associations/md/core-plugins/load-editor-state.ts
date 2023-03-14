import { $convertFromMarkdownString, Transformer } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { IOrdoFile } from "@ordo-pink/fs-entity"
import { useEffect } from "react"
import { useFSAPI } from "../../../core/hooks/use-fs-api"

type Props = {
  file: IOrdoFile
  transformers: Transformer[]
}

export const LoadEditorStatePlugin = ({ file, transformers }: Props) => {
  const [editor] = useLexicalComposerContext()

  const { files } = useFSAPI()

  useEffect(() => {
    if (!editor) return

    files.get(file.path).then((payload) => {
      editor.update(() => {
        $convertFromMarkdownString(payload, transformers)
      })
    })
  }, [editor, file.path, files, transformers])

  return null
}
