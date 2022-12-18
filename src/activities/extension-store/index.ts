import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("extension-store", {
  Component: () => import("$activities/extension-store/components"),
  Icon: () => import("$activities/extension-store/components/icon"),
  readableName: "@ordo-activity-extension-store/title",
  paths: ["extension-store", "extension-store/:type/:name"],
  translations: {
    ru: {
      "@ordo-activity-extension-store/title": "Расширения",
    },
    en: {
      "@ordo-activity-extension-store/title": "Extensions",
    },
  },
})
