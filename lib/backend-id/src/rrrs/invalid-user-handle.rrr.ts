import { RRR } from "@ordo-pink/core"
import { TIntake } from "@ordo-pink/routary"

import { TSharedContext } from "../backend-id.types"

export const invalid_handle_rrr = (handle: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user handle", handle),
	intake,
})

export const exists_by_handle = (handle: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.eexist("user already exists", handle),
	intake,
})
