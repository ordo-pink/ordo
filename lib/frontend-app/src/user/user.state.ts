import { create_zags } from "@ordo-pink/zags"

import type { AuthenticatingUser } from "./user.types"

export const authenticating_user$ = create_zags<AuthenticatingUser.State>({ code: "", email: "" })
