import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("settings", {
  Component: () => import("$activities/settings/components"),
  Icon: () => import("$activities/settings/components/icon"),
  routes: ["/settings", "/settings/:extension"],
  readableName: "@ordo-activity-settings/title",
  translations: {
    ru: {
      "@ordo-activity-settings/title": "Настройки",
    },
    en: {
      "@ordo-activity-settings/title": "Settings",
    },
  },
})
