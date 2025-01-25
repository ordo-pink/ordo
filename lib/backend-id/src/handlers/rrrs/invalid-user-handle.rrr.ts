import { RRR } from "@ordo-pink/core"
import { TIntake } from "@ordo-pink/routary"

import { TSharedContext } from "../../backend-id.types"

export const invalid_user_handle = (handle: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user handle", handle),
	intake,
})
