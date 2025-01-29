import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"

export const verify_auth_token = (intake: TIntake<TSharedContext>) => (token: string) =>
	Oath.FromPromise(() => intake.wjwt.verify(token)).pipe(
		ops0.rejected_map(error => ({ rrr: RRR.codes.einval(error.message, error.name, error.cause, error.stack), intake })),
	)
