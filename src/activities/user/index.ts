import { createActivityExtension } from "$core/extensions/create-activity-extension"

export default createActivityExtension("user", {
  Component: () => import("$activities/user/components"),
  Icon: () => import("$activities/user/components/icon"),
  readableName: "@ordo-activity-user/title",
  translations: {
    ru: {
      "@ordo-activity-user/title": "Личный кабинет",
    },
    en: {
      "@ordo-activity-user/title": "Account",
    },
  },
})
