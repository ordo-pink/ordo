import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OrdoFilePath } from "@ordo-pink/core"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import { useFSAPI } from "$core/hooks/use-fs-api"

export const EditorStatePlugin = () => {
  const [path, setPath] = useState<OrdoFilePath>("" as OrdoFilePath)

  const [editor] = useLexicalComposerContext()
  const [query] = useSearchParams()
  const { files } = useFSAPI()

  useEffect(() => {
    setPath(query.get("path") as OrdoFilePath)
  }, [query])

  useEffect(() => {
    if (!path || !editor) return

    files.get(path).then((payload) => {
      editor.update(() => {
        $convertFromMarkdownString(payload, TRANSFORMERS)
      })
    })
  }, [path, editor, files])

  return null
}
