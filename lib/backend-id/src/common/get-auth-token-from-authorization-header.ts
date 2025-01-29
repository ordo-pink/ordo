import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const get_token_from_authorization_header = (intake: TIntake<TSharedContext>) =>
	Oath.FromNullable(intake.req.headers.get("authorization"))
		.pipe(ops0.rejected_map(() => ({ rrr: RRR.codes.eacces("Missing Authorization header"), intake })))
		.pipe(ops0.map(header => header.replace("Bearer ", "")))
