import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"

const EditorActivity = {
  routes: ["/editor", "/editor/:filePath*"],
  Component: lazy(() => import("./components/editor-component")),
  Icon: lazy(() => import("./components/editor-icon")),
  Sidebar: lazy(() => import("./components/editor-sidebar")),
  name: "editor.editor",
}

export default createExtension("editor", ({ registerActivity }) => {
  registerActivity(EditorActivity)
})
