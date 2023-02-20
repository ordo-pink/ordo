import { createActivityExtension } from "@ordo-pink/extensions"
import { GoToFeaturesCommand } from "./commands/go-to-features"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

export default createActivityExtension("features", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  routes: ["/features", "/features/:feature"],
  readableName: "@ordo-activity-features/title",
  commands: [GoToFeaturesCommand],
  translations: { en, ru },
})
