import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const redundant_auth_rrr = (email: Ordo.User.Email, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.eperm("Authentication was not requested", email),
	intake,
})
