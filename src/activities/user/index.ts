import { createActivityExtension } from "$core/extensions/create-activity-extension"
import { router } from "$core/router"

export default createActivityExtension("user", {
  Component: () => import("$activities/user/components"),
  Icon: () => import("$activities/user/components/icon"),
  readableName: "@ordo-activity-user/title",
  commands: [
    {
      Icon: () => import("$activities/user/components/icon"),
      title: "@ordo-activity-user/open-account",
      accelerator: "ctrl+shift+u",
      showInCommandPalette: true,
      showInContextMenu: false,
      // TODO: Provide router methods in env
      action: () => router.navigate("/user"),
    },
  ],
  translations: {
    ru: {
      "@ordo-activity-user/title": "Личный кабинет",
      "@ordo-activity-user/open-account": "Открыть личный кабинет",
    },
    en: {
      "@ordo-activity-user/title": "Account",
      "@ordo-activity-user/open-account": "Open Account",
    },
  },
})
