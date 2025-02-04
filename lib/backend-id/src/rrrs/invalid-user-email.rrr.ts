import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const invalid_email_rrr = (email: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid email", email),
	intake,
})

export const email_missing_rrr = (intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("email not provided"),
	intake,
})

export const exists_by_email_rrr = (email: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.eexist("user already exists", email),
	intake,
})
