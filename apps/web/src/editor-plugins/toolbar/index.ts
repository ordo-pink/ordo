import { createEditorPluginExtension } from "@ordo-pink/extensions"
import ToolbarPlugin from "./components"

export default createEditorPluginExtension("toolbar", {
  editorPlugins: [ToolbarPlugin],
})
