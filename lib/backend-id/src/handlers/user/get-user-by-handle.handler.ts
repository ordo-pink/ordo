import { Oath, ops0 } from "@ordo-pink/oath"
import { PublicUser } from "@ordo-pink/core"
import { default_handler } from "../default.handler"
import { invalid_user_handle } from "../rrrs/invalid-user-handle.rrr"

export const handle_get_user_by_handle = default_handler(intake =>
	Oath.Resolve(intake.params.user_handle)
		.pipe(ops0.chain(x => Oath.If(is_handle(x), { F: () => invalid_user_handle(x, intake), T: () => x as Ordo.User.Handle })))
		.pipe(ops0.chain(h => intake.user_persistence_strategy.get_by_handle(h).pipe(ops0.rejected_map(rrr => ({ rrr, intake })))))
		.pipe(ops0.map(PublicUser.Serialize))
		.pipe(ops0.map(u => void (intake.payload = u)))
		.pipe(ops0.map(() => intake)),
)

const is_handle = PublicUser.Validations.is_handle
