import { CurrentUser, RRR } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { type TIntake } from "@ordo-pink/routary"
import { extract_request_body } from "@ordo-pink/backend-util-extract-body"
import { is_non_empty_string } from "@ordo-pink/tau"

import { type TSharedContext } from "../../backend-id.types"
import { create_auth_token } from "../../common/create-auth-token"
import { default_handler } from "../default.handler"
import { extract_body_email } from "./request-code.handler"
import { persist_token } from "../../common/persist-token"
import { redundant_auth_rrr } from "../../rrrs/redundant-auth.rrr"

export const handle_validate_code = default_handler(intake =>
	extract_request_body(intake)
		.and(validate_request_body(intake))
		.and(validate_user_code(intake))
		.and(drop_user_code(intake))
		.pipe(ops0.tap(send_sign_in_notification(intake)))
		.and(create_auth_token(intake))
		.and(persist_token(intake))
		.pipe(ops0.tap(({ jwt, user }) => void (intake.payload = { token: jwt.token, user: CurrentUser.Serialize(user) })))
		.and(() => intake),
)

// --- Internal ---

type I = TIntake<TSharedContext>

const validate_request_body = (intake: I) => (body: any) =>
	Oath.Merge({
		email: extract_body_email(intake)(body),
		code: extract_body_email_code(intake)(body),
	})

const verify_password = (code: string, intake: I) => (user: OrdoInternal.User.PrivateDTO) =>
	Oath.FromPromise(() => Bun.password.verify(code, user.email_code!))
		.pipe(ops0.chain(is_valid => Oath.If(is_valid, { T: () => user })))
		.pipe(ops0.rejected_map(() => invalid_code_error(code, intake)))

const validate_user_code =
	(intake: I) =>
	({ email, code }: { email: Ordo.User.Email; code: string }) =>
		intake.user_persistence_strategy
			.get_by_email(email)
			.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
			.pipe(ops0.chain(u => Oath.FromNullable(u.email_code, () => redundant_auth_rrr(email, intake)).pipe(ops0.map(() => u))))
			.pipe(ops0.chain(verify_password(code, intake)))

const drop_user_code = (intake: I) => (user: OrdoInternal.User.PrivateDTO) =>
	intake.user_persistence_strategy
		.update(user.id, { ...user, email_code: void 0 })
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
		.pipe(ops0.map(() => user))

const send_sign_in_notification = (intake: I) => (user: OrdoInternal.User.PrivateDTO) =>
	intake.notification_strategy.send_email({
		to: user.email,
		subject: "Account login", // TODO i18n
		content: `Someone logged in (IP ${intake.request_ip?.address ?? "not detected"})`, // TODO Actual body
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
