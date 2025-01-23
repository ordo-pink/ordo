import { Oath, ops0 } from "@ordo-pink/oath"
import { PublicUser, RRR } from "@ordo-pink/core"
import { TIntake } from "@ordo-pink/routary"

import { TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"

export const handle_get_user_by_handle = default_handler(intake =>
	Oath.If(PublicUser.Validations.is_handle(intake.params.user_handle), {
		F: () => invalid_user_handle(intake.params.user_handle, intake),
	})
		.pipe(
			ops0.chain(() =>
				intake.user_persistence_strategy
					.get_by_handle(intake.params.user_handle as Ordo.User.Handle)
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake }))),
			),
		)
		.pipe(ops0.map(PublicUser.Serialize))
		.pipe(ops0.map(user => void (intake.payload = user)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

const invalid_user_handle = (handle: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user handle", handle),
	intake,
})
