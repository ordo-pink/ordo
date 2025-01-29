import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const invalid_id_rrr = (id: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user id", id),
	intake,
})
