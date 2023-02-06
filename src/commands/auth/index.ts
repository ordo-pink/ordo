import { ChangeEmailCommand } from "$commands/auth/commands/change-email"
import { ChangePasswordCommand } from "$commands/auth/commands/change-password"
import { DeleteAccount } from "$commands/auth/commands/delete-account"
import { LoginCommand } from "$commands/auth/commands/login"
import { LogoutCommand } from "$commands/auth/commands/logout"
import { RegisterCommand } from "$commands/auth/commands/register"
import { slice } from "$commands/auth/store"
import en from "$commands/auth/translations/en.json"
import ru from "$commands/auth/translations/ru.json"

import { createCommandExtension } from "$core/extensions/create-command-extension"

export default createCommandExtension("auth", {
  translations: { en, ru },
  commands: [
    RegisterCommand,
    LoginCommand,
    LogoutCommand,
    ChangePasswordCommand,
    ChangeEmailCommand,
    DeleteAccount,
  ],
  overlayComponents: [() => import("$commands/auth/components/logout-modal")],
  storeSlice: slice,
  readableName: "@ordo-command-auth/readable-name",
})
