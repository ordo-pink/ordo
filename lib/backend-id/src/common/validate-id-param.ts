import { Oath, ops0 } from "@ordo-pink/oath"
import { CurrentUser } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"
import { invalid_id_rrr } from "../rrrs/invalid-user-id.rrr"

export const check_if_id_param_is_valid = (intake: TIntake<TSharedContext>) =>
	Oath.Resolve(intake.params.user_id)
		.and(id => Oath.If(is_id(id)))
		.pipe(ops0.rejected_map(() => invalid_id_rrr(intake.params.user_id, intake)))

const { is_id } = CurrentUser.Validations
