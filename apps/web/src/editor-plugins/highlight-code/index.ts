import { registerCodeHighlighting } from "@lexical/code"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import { createEditorPluginExtension } from "../../core/extensions/create-editor-plugin"

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
  plugins: [HighlightCodePlugin],
})
