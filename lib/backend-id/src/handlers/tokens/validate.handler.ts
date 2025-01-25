import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"

import { default_handler } from "../default.handler"

export const handle_validate_token = default_handler(intake =>
	Oath.FromNullable(intake.req.headers.get("authorization"), () => ({
		rrr: RRR.codes.eacces("Missing Authorization header"),
		intake,
	}))

		.pipe(ops0.map(header => header.replace("Bearer ", "")))
		.pipe(
			ops0.chain(token =>
				Oath.FromPromise(() => intake.wjwt.verify(token))
					.pipe(
						ops0.rejected_map(error => ({
							rrr: RRR.codes.einval(error.message, error.name, error.cause, error.stack),
							intake,
						})),
					)
					.pipe(ops0.map(is_valid => void (intake.payload = is_valid))),
			),
		)

		.pipe(ops0.map(() => intake)),
)
