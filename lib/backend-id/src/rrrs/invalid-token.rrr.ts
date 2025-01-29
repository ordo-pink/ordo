import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const invalid_token_rrr = (intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.eacces("Provided token is invalid"),
	intake,
})
