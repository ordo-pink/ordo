import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useEffect } from "react"
import { createEditorPluginExtension } from "$core/extensions/create-editor-plugin"

const AutofocusPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    editor.focus()
  }, [editor])

  return null
}

export default createEditorPluginExtension("autofocus", {
  plugins: [AutofocusPlugin],
})
