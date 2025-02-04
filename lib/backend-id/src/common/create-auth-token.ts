import { Oath, ops0 } from "@ordo-pink/oath"
import { type TIntake } from "@ordo-pink/routary"
import { unknown_error } from "@ordo-pink/backend-util-extract-body"

import { type TSharedContext } from "../backend-id.types"

export const create_auth_token = (intake: TIntake<TSharedContext>) => (user: OrdoInternal.User.PrivateDTO) =>
	Oath.FromPromise(() =>
		intake.wjwt.sign({
			sub: user.id,
			lim: user.file_limit,
			mus: user.max_upload_size,
			sbs: user.subscription,
		}),
	)
		.pipe(ops0.map(jwt => ({ jwt, user })))
		.pipe(ops0.rejected_map(rrr => unknown_error(rrr, intake)))
