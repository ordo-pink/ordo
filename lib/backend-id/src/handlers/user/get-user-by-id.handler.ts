import { Oath, ops0 } from "@ordo-pink/oath"
import { PublicUser, RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"

export const handle_get_user_by_id = default_handler(intake =>
	Oath.If(PublicUser.Validations.is_id(intake.params.user_id), { F: () => invalid_user_id(intake.params.user_id, intake) })
		.pipe(
			ops0.chain(() =>
				intake.user_persistence_strategy
					.get_by_id(intake.params.user_id as Ordo.User.ID)
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake }))),
			),
		)
		.pipe(ops0.map(PublicUser.Serialize))
		.pipe(ops0.map(user => void (intake.payload = user)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

const invalid_user_id = (id: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user id", id),
	intake,
})
