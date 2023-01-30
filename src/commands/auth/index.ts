import { ChangePasswordCommand } from "$commands/auth/commands/change-password"
import { LogoutCommand } from "$commands/auth/commands/logout"
import { slice } from "$commands/auth/store"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("auth", {
  translations: {
    ru: {
      "@ordo-command-auth/readable-name": "Авторизация",
      "@ordo-command-auth/logout": "Выйти из аккаунта",
      "@ordo-command-auth/change-password": "Сменить пароль",
      "@ordo-command-auth/confirm-logout": "Вы уверены, что хотите выйти?",
      "@ordo-command-auth/button-ok": "Да",
      "@ordo-command-auth/button-cancel": "Нет",
      "@ordo-command-auth/change-password-email-subject": "Запрос на смену пароля для {{email}}",
      "@ordo-command-auth/change-password-email-body":
        "Привет,%0A%0AЯ бы хотел запросить смену пароля для моего аккаунта в Ordo.%0A%0A{{username}}",
    },
    en: {
      "@ordo-command-auth/readable-name": "Authentication",
      "@ordo-command-auth/logout": "Log Out",
      "@ordo-command-auth/change-password": "Change password",
      "@ordo-command-auth/confirm-logout": "Are you sure you want to log out?",
      "@ordo-command-auth/button-ok": "Yes",
      "@ordo-command-auth/button-cancel": "No",
      "@ordo-command-auth/change-password-email-subject": "Password change for {{email}}",
      "@ordo-command-auth/change-password-email-body":
        "Hi,%0A%0AI'd like to reset my password for the Ordo account.%0A%0A{{username}}",
    },
  },
  commands: [LogoutCommand, ChangePasswordCommand],
  overlayComponents: [() => import("$commands/auth/components/logout-modal")],
  storeSlice: slice,
  readableName: "@ordo-command-auth/readable-name",
})
