import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OrdoFilePath } from "@ordo-pink/core"
import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import { useFSAPI } from "$core/hooks/use-fs-api"

export const EditorStatePlugin = () => {
  const [editor] = useLexicalComposerContext()
  const [query] = useSearchParams()
  const { files } = useFSAPI()

  useEffect(() => {
    if (!editor) return

    const path = query.get("path") as OrdoFilePath

    files.get(path).then((payload) => {
      editor.update(() => {
        $convertFromMarkdownString(payload, TRANSFORMERS)
      })
    })
  }, [query, editor, files])

  return null
}
