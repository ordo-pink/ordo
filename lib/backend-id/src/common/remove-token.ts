import { Oath, ops0 } from "@ordo-pink/oath"
import { type TIntake } from "@ordo-pink/routary"
import { unknown_error } from "@ordo-pink/backend-util-extract-body"

import { type TSharedContext } from "../backend-id.types"

export const remove_token = (intake: TIntake<TSharedContext>) => (token: string) =>
	Oath.Try(() => intake.wjwt.decode(token))
		.pipe(ops0.rejected_map(error => unknown_error(error, intake)))
		.and(jwt => jwt.payload)
		.and(payload =>
			intake.token_persistence_strategy
				.remove_token(payload.sub, payload.jti)
				.pipe(ops0.rejected_map(rrr => ({ rrr, intake }))),
		)
		.and(() => token)
