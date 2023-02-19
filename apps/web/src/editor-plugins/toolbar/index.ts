import ToolbarPlugin from "./components"
import { createEditorPluginExtension } from "../../core/extensions/create-editor-plugin"

export default createEditorPluginExtension("toolbar", {
  plugins: [ToolbarPlugin],
})
