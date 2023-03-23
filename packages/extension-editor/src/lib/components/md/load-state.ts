import { $convertFromMarkdownString, Transformer } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { IOrdoFile } from "@ordo-pink/common-types"
import { useFsDriver } from "@ordo-pink/react-utils"
import { useEffect } from "react"

type Props = {
  file: IOrdoFile
  transformers: Transformer[]
}

export const LoadEditorStatePlugin = ({ file, transformers }: Props) => {
  const [editor] = useLexicalComposerContext()

  const fsDriver = useFsDriver()

  useEffect(() => {
    if (!editor || !fsDriver) return

    fsDriver.files
      .getContent(file.path)
      .then((res) => res.text())
      .then((payload) => {
        editor.update(() => {
          $convertFromMarkdownString(payload, transformers)
        })
      })
  }, [editor, file, file.path, fsDriver, transformers])

  return null
}
