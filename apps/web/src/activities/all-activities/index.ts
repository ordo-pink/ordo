import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { createActivityExtension } from "../../core/extensions/create-activity-extension"

/**
 * All Activities is an activity extension that adds a place for all
 * activity extensions installed in user's Ordo space.
 */
export default createActivityExtension("all-activities", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  routes: ["all-activities"],
  readableName: "@ordo-activity-all-activities/title",
  translations: { en, ru },
})
