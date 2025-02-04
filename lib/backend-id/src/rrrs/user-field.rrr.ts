import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const invalid_installed_functions_rrr = (installed_functions: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid installed functions", installed_functions),
	intake,
})

export const invalid_first_name_rrr = (first_name: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid first name", first_name),
	intake,
})

export const invalid_last_name_rrr = (last_name: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid last name", last_name),
	intake,
})
