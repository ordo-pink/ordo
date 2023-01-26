import { OpenUserSupport } from "$commands/user-support/commands/open-user-support"
import { slice } from "$commands/user-support/store"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("user-support", {
  translations: {
    ru: {
      "@ordo-command-user-support/readable-name": "Поддержка",
      "@ordo-command-user-support/open-user-support": "Связаться с поддержкой",
      "@ordo-command-user-support/call-to-support": "Какой способ связи вы предпочитаете?",
      "@ordo-command-user-support/button-telegram": "Telegram",
      "@ordo-command-user-support/button-email": "Email",
      "@ordo-command-user-support/button-cancel": "Отмена",
    },
    en: {
      "@ordo-command-user-support/readable-name": "Support",
      "@ordo-command-user-support/open-user-support": "Request support",
      "@ordo-command-user-support/call-to-support": "Which communication method do you prefer?",
      "@ordo-command-user-support/button-telegram": "Telegram",
      "@ordo-command-user-support/button-email": "Email",
      "@ordo-command-user-support/button-cancel": "Cancel",
    },
  },
  commands: [OpenUserSupport],
  overlayComponents: [() => import("$commands/user-support/components/user-support-modal")],
  storeSlice: slice,
  readableName: "@ordo-command-user-support/readable-name",
})
