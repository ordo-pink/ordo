import { createActivityExtension } from "$core/extensions/create-activity-extension"

/**
 * All Activities is an activity extension that adds a place for all
 * activity extensions installed in user's Ordo space.
 */
export default createActivityExtension("all-activities", {
  Component: () => import("$activities/all-activities/components"),
  Icon: () => import("$activities/all-activities/components/icon"),
  readableName: "@ordo-activity-all-activities/title",
  translations: {
    ru: {
      "@ordo-activity-all-activities/title": "Установленные расширения",
    },
    en: {
      "@ordo-activity-all-activities/title": "All installed extensions",
    },
  },
})
