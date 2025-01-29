import { type TIntake } from "@ordo-pink/routary"
import { type TWJWTSignResult } from "@ordo-pink/wjwt"
import { ops0 } from "@ordo-pink/oath"

import { type TSharedContext } from "../backend-id.types"

export const persist_token =
	(intake: TIntake<TSharedContext>) =>
	({ jwt, user }: { jwt: TWJWTSignResult; user: OrdoInternal.User.PrivateDTO }) =>
		intake.token_persistence_strategy
			.set_token(jwt.payload.sub, jwt.payload.jti, { exp: jwt.payload.exp + intake.persisted_token_lifetime })
			.and(() => ({ jwt, user }))
			.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
