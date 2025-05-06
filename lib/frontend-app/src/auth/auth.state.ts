import { create_zags } from "@ordo-pink/zags"

import { Auth } from "./auth.types"

export const auth$ = create_zags<Auth.State>({ email: "", code: "" })
