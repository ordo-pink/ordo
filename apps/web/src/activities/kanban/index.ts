import { createActivityExtension } from "@ordo-pink/extensions"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("kanban", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  readableName: "@ordo-activity-kanban/title",
  routes: ["/kanban"],
  translations: { en, ru },
})
