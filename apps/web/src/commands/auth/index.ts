import { ChangeEmailCommand } from "./commands/change-email"
import { ChangePasswordCommand } from "./commands/change-password"
import { DeleteAccount } from "./commands/delete-account"
import { LoginCommand } from "./commands/login"
import { LogoutCommand } from "./commands/logout"
import { RegisterCommand } from "./commands/register"
import { slice } from "./store"
import en from "./translations/en.json"
import ru from "./translations/ru.json"

import { createCommandExtension } from "../../core/extensions/create-command-extension"

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
  overlayComponents: [() => import("./components/logout-modal")],
  storeSlice: slice,
  readableName: "@ordo-command-auth/readable-name",
})
