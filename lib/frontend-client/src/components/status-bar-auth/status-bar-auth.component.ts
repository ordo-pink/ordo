import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { SignIn } from "./status-bar-sign-in.component"
import { User } from "./status-bar-user.component"

const div = create<TOrdoHooks>("div")

export const StatusBarAuth = div(use => (use.get_is_authenticated() ? User : SignIn))
