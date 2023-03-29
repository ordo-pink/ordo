import { registerCodeHighlighting } from "@lexical/code"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"

export default function HighlightCodePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.update(() => {
      registerCodeHighlighting(editor)
    })
  }, [editor])

  return null
}
