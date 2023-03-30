import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { OrdoKanbanNode } from "./ordo-kanban/node"
import { ORDO_KANBAN_TRANSFORMER } from "./ordo-kanban/transformer"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

import "./index.css"

export default createExtension(
  "kanban",
  ({ registerTranslations, registerActivity, registerEditorPlugin, commands }) => {
    registerTranslations({ ru, en })

    commands.on("open-kanban-board", ({ payload }) => {
      commands.emit("router.navigate", payload ? `/kanban${payload}` : "/kanban")
    })

    registerEditorPlugin("kanban-plugin", {
      nodes: [OrdoKanbanNode],
      transformer: ORDO_KANBAN_TRANSFORMER,
    })

    // TODO: Watch files for content updates, extract kanbans
    // commands.after("editor.update-file-content", console.log)

    registerActivity("board", {
      routes: ["/kanban", "/kanban/:board"],
      Component: lazy(() => import("./components/component")),
      Icon: lazy(() => import("./components/icon")),
      Sidebar: lazy(() => import("./components/sidebar")),
    })
  },
)
