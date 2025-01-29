import { CurrentUser, RRR, UserSubscription } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { extract_request_body, unknown_error } from "@ordo-pink/backend-util-extract-body"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"

export const handle_request_code = default_handler(intake =>
	extract_request_body(intake)
		.pipe(ops0.chain(extract_body_email(intake)))
		.pipe(ops0.chain(get_or_create_user(intake)))
		.pipe(ops0.chain(update_user_code(intake)))
		.pipe(
			ops0.tap(({ codes, email }) =>
				intake.notification_strategy.send_email({
					from: "hello@ordo.pink", // TODO Take from intake
					to: email,
					subject: "Sign in code for your ORDO account", // TODO i18n
					content: codes.code, // TODO Actual body
				}),
			),
		)
		// TODO Send notification
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = TIntake<TSharedContext>

const hash_argon2 = (intake: I) => (code: string) =>
	Oath.FromPromise(() => Bun.password.hash(code))
		.pipe(ops0.map(hash => ({ code, hash })))
		.pipe(ops0.rejected_map(e => unknown_error(e, intake)))

// TODO Move to util
export const extract_body_email = (intake: I) => (request_body: any) =>
	Oath.FromNullable(request_body.email, () => email_not_provided_error(intake)).pipe(
		ops0.chain(email => Oath.If(is_email(email), { T: () => email, F: () => invalid_email_error(email, intake) })),
	)

const is_email = CurrentUser.Validations.is_email

const invalid_email_error = (email: unknown, intake: I) => ({
	rrr: RRR.codes.einval("invalid email", email),
	intake,
})

const email_not_provided_error = (intake: I) => ({
	rrr: RRR.codes.einval("email not provided"),
	intake,
})

const create_handle = (email: Ordo.User.Email, id: Ordo.User.ID) =>
	`@${email.split("@")[0]}${id.split("-")[0]}` as Ordo.User.Handle

const check_handle_is_free = (handle: Ordo.User.Handle, intake: I) =>
	intake.user_persistence_strategy
		.exists_by_handle(handle)
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
		.pipe(
			ops0.chain(exists =>
				Oath.If(!exists, {
					T: () => handle,
					F: () => unknown_error("cannot create user", intake),
				}),
			),
		)

const get_or_create_user = (intake: I) => (email: Ordo.User.Email) =>
	Oath.Resolve(crypto.randomUUID())
		.pipe(
			ops0.chain(id =>
				check_handle_is_free(create_handle(email, id), intake).pipe(ops0.map(handle => ({ id, email, handle }))),
			),
		)
		.pipe(
			ops0.chain(({ email, handle, id }) =>
				intake.user_persistence_strategy
					.get_by_email(email)
					.pipe(ops0.rejected_map(() => intake))
					.fix(create_user(email, id, handle)),
			),
		)

const update_user_code = (intake: I) => (user: OrdoInternal.User.PrivateDTO) =>
	Oath.Resolve(new Uint8Array(6))
		.pipe(ops0.map(ua => crypto.getRandomValues(ua)))
		.pipe(ops0.map(nums => nums.join("")))
		.pipe(ops0.map(str => str.slice(0, 6)))
		.pipe(ops0.chain(hash_argon2(intake)))
		.pipe(ops0.map(codes => ({ codes, user })))
		.pipe(
			ops0.chain(({ codes, user }) =>
				intake.user_persistence_strategy
					.update(user.id, { ...user, email_code: codes.hash })
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
					.pipe(ops0.map(() => ({ codes, email: user.email }))),
			),
		)

const create_user = (email: Ordo.User.Email, id: Ordo.User.ID, handle: Ordo.User.Handle) => (intake: I) =>
	intake.user_persistence_strategy
		.create({
			created_at: Date.now(),
			email,
			id,
			subscription: UserSubscription.FREE,
			file_limit: 1000, // TODO Move to env
			installed_functions: [],
			max_functions: 10, // TODO Move to env
			max_upload_size: 1.5, // TODO Move to env
			handle,
		})
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
