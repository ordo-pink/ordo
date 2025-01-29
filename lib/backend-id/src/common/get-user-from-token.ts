import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const get_user_from_token = (intake: TIntake<TSharedContext>) => (token: string) =>
	Oath.Try(() => intake.wjwt.decode(token))
		.pipe(ops0.rejected_map(error => RRR.codes.einval(error.message, error.name, error.cause, error.stack)))
		.and(token => token.payload.sub)
		.and(id => intake.user_persistence_strategy.get_by_id(id).pipe(ops0.rejected_map(rrr => ({ rrr, intake }))))
