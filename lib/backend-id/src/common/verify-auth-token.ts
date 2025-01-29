import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"
import { unknown_error } from "@ordo-pink/backend-util-extract-body"

import { type TSharedContext } from "../backend-id.types"
import { invalid_token_rrr } from "../rrrs/invalid-token.rrr"

export const verify_auth_token = (intake: TIntake<TSharedContext>) => (token: string) =>
	Oath.FromPromise(() => intake.wjwt.verify(token))
		.pipe(ops0.rejected_map(error => ({ rrr: RRR.codes.einval(error.message, error.name, error.cause, error.stack), intake })))
		.and(v => Oath.If(v, { T: () => token, F: () => invalid_token_rrr(intake) }))
		.and(token =>
			Oath.Try(() => intake.wjwt.decode(token))
				.pipe(ops0.rejected_map(error => unknown_error(error, intake)))
				.and(({ payload }) => intake.token_persistence_strategy.get_token(payload.sub, payload.jti))
				.and(({ exp }) => Oath.If(exp * 1000 >= Date.now(), { F: () => invalid_token_rrr(intake) }))
				.and(() => token),
		)

export const verify_persisted_auth_token = (intake: TIntake<TSharedContext>) => (token: string) =>
	Oath.Try(() => intake.wjwt.decode(token))
		.pipe(ops0.rejected_map(error => unknown_error(error, intake)))
		.and(({ payload }) => intake.token_persistence_strategy.get_token(payload.sub, payload.jti))
		.and(({ exp }) => Oath.If(exp * 1000 >= Date.now(), { F: () => invalid_token_rrr(intake) }))
		.and(() => token)
