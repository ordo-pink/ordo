import { registerCodeHighlighting } from "@lexical/code"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { createEditorPluginExtension } from "@ordo-pink/extensions"
import { useEffect } from "react"

const HighlightCodePlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.update(() => {
      registerCodeHighlighting(editor)
    })
  }, [editor])

  return null
}

export default createEditorPluginExtension("highlight-code", {
  editorPlugins: [HighlightCodePlugin],
})
