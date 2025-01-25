import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"
import { extract_request_body } from "@ordo-pink/backend-util-extract-body"

import { type TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"
import { extract_body_email } from "./request-code.handler"
import { is_non_empty_string } from "@ordo-pink/tau"

export const handle_validate_code = default_handler(intake =>
	extract_request_body(intake)
		.pipe(
			ops0.chain(body =>
				Oath.Merge({
					email: extract_body_email(intake)(body),
					code: extract_body_email_code(intake)(body),
				}),
			),
		)
		.pipe(
			ops0.chain(
				({ email, code }) =>
					intake.user_persistence_strategy
						.get_by_email(email)
						.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
						.pipe(
							ops0.chain(user =>
								Oath.FromNullable(user.email_code, () => authentication_not_requested_error(email, intake)).pipe(
									ops0.map(() => user),
								),
							),
						)
						.pipe(
							ops0.chain(user =>
								Oath.FromPromise(() => Bun.password.verify(code, user.email_code!))
									.pipe(ops0.chain(is_valid => Oath.If(is_valid, { T: () => user })))
									.pipe(ops0.rejected_map(() => invalid_code_error(code, intake))),
							),
						),

				// TODO Drop user.email_code
				// TODO Send sign in email
				// TODO Return token
			),
		)
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = TIntake<TSharedContext>

export const authentication_not_requested_error = (email: Ordo.User.Email, intake: I) => ({
	rrr: RRR.codes.eperm("Authentication was not requested", email),
	intake,
})

export const invalid_code_error = (code: string, intake: I) => ({
	rrr: RRR.codes.eperm("Provided code is invalid", code),
	intake,
})

export const extract_body_email_code = (intake: I) => (request_body: any) =>
	Oath.FromNullable(request_body.code, () => email_code_not_provided_error(intake)).pipe(
		ops0.chain(code =>
			Oath.If(is_non_empty_string(code) && code.length === 6, {
				T: () => code,
				F: () => invalid_email_code_error(code, intake),
			}),
		),
	)

const invalid_email_code_error = (email: unknown, intake: I) => ({
	rrr: RRR.codes.einval("invalid email code", email),
	intake,
})

const email_code_not_provided_error = (intake: I) => ({
	rrr: RRR.codes.einval("email code not provided"),
	intake,
})
