import { CurrentUser, RRR } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { default_handler, huyami } from "@ordo-pink/routary-ordo"

import * as fns from "../fns"
import { type BackendAuth } from "../backend-au.types"

export const handle_request_code = default_handler<BackendAuth.Chamber>(intake => {
	intake.request_id = intake.create_request_id()
	intake.request_language = fns.get_lang(intake.req)
	const debug = huyami(intake)

	return get_request_body(intake.req)
		.pipe(ops0.chain(validate_request_body))
		.pipe(ops0.tap(debug("Provided email", email => fns.obfuscate_email(email))))
		.pipe(ops0.chain(create_code(intake.code_strategy)))
		.pipe(ops0.tap(debug("Code generated")))
		.pipe(ops0.tap(persist_pair(intake.auth_storage)))
		.pipe(ops0.tap(debug("Auth record persisted")))
		.pipe(ops0.tap(send_email(intake)))
		.pipe(ops0.tap(debug("Email sent")))
		.pipe(ops0.map(() => intake))
		.pipe(ops0.rejected_map(rrr => ({ intake, rrr })))
})

// --- Internal ---

const is_email = CurrentUser.Validations.is_email

// TODO Move to lib

const get_request_body = (req: Request): Oath<any, Ordo.Rrr<"EIO">> =>
	Oath.Try(
		() => req.json(),
		error => RRR.codes.eio("Failed to parse request body", error),
	)

const validate_request_body = (body: any) =>
	Oath.If(body && body.email && is_email(body.email), {
		T: () => body.email as BackendAuth.Email,
		F: () => RRR.codes.einval("Provided email is invalid", body.email),
	})

type Triplet = [BackendAuth.Email, BackendAuth.Code, BackendAuth.CodeHash]

const create_code = (code_strategy: BackendAuth.CodeStrategy) => (email: BackendAuth.Email) =>
	code_strategy
		.generate()
		.and(code => code_strategy.hash(code).and(hash => [code, hash]))
		.and(([code, hash]) => [email, code, hash] as Triplet)

const persist_pair =
	(auth_storage: BackendAuth.Storage) =>
	([email, , hash]: Triplet): void =>
		void auth_storage.set(email, { hash, timestamp: Date.now() })

const send_email =
	(intake: BackendAuth.Intake) =>
	([email, code]: Triplet): void =>
		intake.email_strategy.send({
			to: email,
			content: fns.create_request_code_email_body(intake.request_language, code),
			subject: fns.create_request_code_email_subject(intake.request_language),
		})
