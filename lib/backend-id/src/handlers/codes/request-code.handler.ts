import { Oath, ops0 } from "@ordo-pink/oath"
import { extract_request_body, unknown_error } from "@ordo-pink/backend-util-extract-body"
import { type TIntake } from "@ordo-pink/routary"
import { UserSubscription } from "@ordo-pink/core"

import { type TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"
import { extract_body_email } from "../../common/extract-body-email"

export const handle_request_code = default_handler(intake =>
	extract_request_body(intake)
		.pipe(ops0.chain(extract_body_email(intake)))
		.pipe(ops0.chain(get_or_create_user(intake)))
		.pipe(ops0.chain(update_user_code(intake)))
		.pipe(ops0.tap(send_code(intake)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = TIntake<TSharedContext>

const hash_argon2 = (intake: I) => (code: string) =>
	Oath.FromPromise(() => Bun.password.hash(code))
		.pipe(ops0.map(hash => ({ code, hash })))
		.pipe(ops0.rejected_map(e => unknown_error(e, intake)))

const create_handle = (email: Ordo.User.Email, id: Ordo.User.ID) =>
	`@${email.split("@")[0].replaceAll(".", "_").replaceAll("/", "")}${id.split("-")[0]}` as Ordo.User.Handle

const check_handle_is_free = (handle: Ordo.User.Handle, intake: I) =>
	intake.user_persistence_strategy
		.exists_by_handle(handle)
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
		.pipe(
			ops0.chain(exists =>
				Oath.If(!exists, {
					T: () => handle,
					F: () => unknown_error("Cannot create user", intake),
				}),
			),
		)

const get_or_create_user = (i: I) => (email: Ordo.User.Email) =>
	Oath.Resolve(crypto.randomUUID())
		.pipe(ops0.map(id => ({ handle: create_handle(email, id), id })))
		.pipe(ops0.chain(({ handle, id }) => check_handle_is_free(handle, i).pipe(ops0.map(handle => ({ id, email, handle })))))
		.pipe(
			ops0.chain(({ email, handle, id }) =>
				i.user_persistence_strategy
					.get_by_email(email)
					.pipe(ops0.rejected_map(() => i))
					.fix(create_user(email, id, handle)),
			),
		)

const update_user_code = (i: I) => (user: OrdoBackend.User.DTO) =>
	Oath.Resolve(new Uint8Array(6))
		.pipe(ops0.map(ua => crypto.getRandomValues(ua)))
		.pipe(ops0.map(nums => nums.join("")))
		.pipe(ops0.map(str => str.slice(0, 6)))
		.pipe(ops0.chain(hash_argon2(i)))
		.pipe(ops0.map(codes => ({ codes, user })))
		.pipe(
			ops0.chain(({ codes, user }) =>
				i.user_persistence_strategy
					.update(user.id, { ...user, email_code: codes.hash })
					.pipe(ops0.rejected_map(rrr => ({ rrr, intake: i })))
					.pipe(ops0.map(() => ({ codes, email: user.email }))),
			),
		)

const create_user = (email: Ordo.User.Email, id: Ordo.User.ID, handle: Ordo.User.Handle) => (i: I) =>
	i.user_persistence_strategy
		.create({
			created_at: Date.now(),
			email,
			id,
			subscription: UserSubscription.FREE,
			file_limit: i.defaults.file_limit,
			installed_functions: [],
			max_functions: i.defaults.max_functions,
			max_upload_size: i.defaults.max_upload_size,
			handle,
		})
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake: i })))

type P2 = { codes: { code: string; hash: string }; email: Ordo.User.Email }
const send_code =
	(i: I) =>
	({ codes, email }: P2) =>
		// TODO Create email with Maoka
		i.notification_strategy.send({
			to: email,
			subject: "Sign in code for your ORDO account",
			content: `Code: ${codes.code}; Link: http://localhost:3004/auth/verify?email=${email}&code=${codes.code}`,
		})
