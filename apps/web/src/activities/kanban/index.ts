import { createActivityExtension } from "@ordo-pink/extensions"
import { OrdoKanbanNode } from "./ordo-kanban/node"
import { ORDO_KANBAN_TRANSFORMER } from "./ordo-kanban/transformer"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("kanban", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-kanban/title",
  routes: ["/kanban"],
  translations: { en, ru },
  nodes: [OrdoKanbanNode],
  transformers: [ORDO_KANBAN_TRANSFORMER],
})
