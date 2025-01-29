import { Oath, ops0 } from "@ordo-pink/oath"
import { PublicUser } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"
import { invalid_handle_rrr } from "../../rrrs/invalid-user-handle.rrr"

export const handle_get_user_by_handle = default_handler(intake =>
	Oath.Resolve(intake.params.user_handle)
		.pipe(ops0.chain(validate_user_handle(intake)))
		.pipe(ops0.chain(get_user_by_handle(intake)))
		.pipe(ops0.map(serialize_to_public_user))
		.pipe(ops0.map(user => void (intake.payload = user)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = TIntake<TSharedContext>

const is_handle = PublicUser.Validations.is_handle

const serialize_to_public_user = PublicUser.Serialize

const validate_user_handle = (intake: I) => (handle?: string) =>
	Oath.If(is_handle(handle), { F: () => invalid_handle_rrr(handle!, intake), T: () => handle as Ordo.User.Handle })

const get_user_by_handle = (intake: I) => (handle: Ordo.User.Handle) =>
	intake.user_persistence_strategy.get_by_handle(handle).pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
