import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { IOrdoFile } from "@ordo-pink/core"
import { useEffect } from "react"
import { useFSAPI } from "$core/hooks/use-fs-api"

type Props = {
  file: IOrdoFile
}

export const LoadEditorStatePlugin = ({ file }: Props) => {
  const [editor] = useLexicalComposerContext()

  const { files } = useFSAPI()

  useEffect(() => {
    if (!editor) return

    files.get(file.path).then((payload) => {
      editor.update(() => {
        $convertFromMarkdownString(payload, TRANSFORMERS)
      })
    })
  }, [editor, file.path, files])

  return null
}
