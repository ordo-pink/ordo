import { CurrentUser, PublicUser, RRR } from "@ordo-pink/core"
import { Oath, ops0 } from "@ordo-pink/oath"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"

export const handle_update_user = default_handler(intake =>
	Oath.Merge([
		Oath.If(PublicUser.Validations.is_id(intake.params.user_id), {
			F: () => throw_invalid_user_id(intake.params.user_id, intake),
		}),
	])
		.pipe(
			ops0.chain(() =>
				Oath.FromPromise(() => intake.req.json() as Promise<Partial<OrdoInternal.User.PrivateDTO>>)
					.pipe(ops0.rejected_map(error => throw_bad_request(error, intake)))
					.pipe(
						ops0.chain(body =>
							Oath.Merge([
								body.email
									? Oath.If(CurrentUser.Validations.is_email(body.email), {
											F: () => throw_invalid_email(body.email!, intake),
											T: () => body.email!,
										})
											.pipe(ops0.chain(email => intake.user_persistence_strategy.get_by_email(email).fix(() => null)))
											.pipe(
												ops0.chain(user =>
													Oath.If(!user || user.id === intake.params.user_id, {
														F: () => throw_exists_by_email(body.email!, intake),
													}),
												),
											)
									: Oath.Resolve(void 0),

								body.handle
									? Oath.If(CurrentUser.Validations.is_handle(body.handle), {
											F: () => throw_invalid_handle(body.handle!, intake),
											T: () => body.handle!,
										})
											.pipe(ops0.chain(handle => intake.user_persistence_strategy.get_by_handle(handle).fix(() => null)))
											.pipe(
												ops0.chain(user =>
													Oath.If(!user || user.id === intake.params.user_id, {
														F: () => throw_exists_by_handle(body.handle!, intake),
													}),
												),
											)
									: Oath.Resolve(void 0),

								body.installed_functions
									? Oath.If(CurrentUser.Validations.is_installed_functions(body.installed_functions), {
											F: () => throw_invalid_installed_functions(body.installed_functions, intake),
										})
									: Oath.Resolve(void 0),

								body.first_name
									? Oath.If(CurrentUser.Validations.is_first_name(body.first_name), {
											F: () => throw_invalid_first_name(body.first_name, intake),
										})
									: Oath.Resolve(void 0),

								body.last_name
									? Oath.If(CurrentUser.Validations.is_last_name(body.last_name), {
											F: () => throw_invalid_last_name(body.last_name, intake),
										})
									: Oath.Resolve(void 0),
							]).pipe(ops0.map(() => body)),
						),
					)
					// TODO Validate body
					.pipe(
						ops0.chain(updated_user =>
							intake.user_persistence_strategy
								.get_by_id(intake.params.user_id as Ordo.User.ID)
								.pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
								.pipe(ops0.map(user => ({ user, updated_user }))),
						),
					),
			),
		)
		.pipe(ops0.map(merge_users))
		.pipe(ops0.chain(update_user(intake.params.user_id as Ordo.User.ID, intake)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

const throw_bad_request = (error: Error, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.eio(error.message, error.cause, error.name, error.stack),
	intake,
})

const throw_invalid_user_id = (id: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user id", id),
	intake,
})

const throw_invalid_email = (email: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user email", email),
	intake,
})

const throw_exists_by_email = (email: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.eexist("user already exists", email),
	intake,
})

const throw_invalid_handle = (handle: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid user handle", handle),
	intake,
})

const throw_exists_by_handle = (handle: string, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.eexist("user already exists", handle),
	intake,
})

const throw_invalid_installed_functions = (installed_functions: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid installed functions", installed_functions),
	intake,
})

const throw_invalid_first_name = (first_name: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid first name", first_name),
	intake,
})

const throw_invalid_last_name = (last_name: unknown, intake: TIntake<TSharedContext>) => ({
	rrr: RRR.codes.einval("invalid last name", last_name),
	intake,
})

const update_user = (id: Ordo.User.ID, intake: TIntake<TSharedContext>) => (user: OrdoInternal.User.PrivateDTO) =>
	intake.user_persistence_strategy.update(id, user).pipe(ops0.rejected_map(rrr => ({ rrr, intake })))

const merge_users = (users: {
	user: OrdoInternal.User.PrivateDTO
	updated_user: Partial<OrdoInternal.User.PrivateDTO>
}): OrdoInternal.User.PrivateDTO => ({
	created_at: users.user.created_at,
	email_code: users.user.email_code,
	file_limit: users.user.file_limit,
	id: users.user.id,
	max_functions: users.user.max_functions,
	max_upload_size: users.user.max_upload_size,
	password: users.user.password,
	subscription: users.user.subscription,

	email: users.updated_user.email ?? users.user.email,
	first_name: users.updated_user.first_name ?? users.user.first_name,
	handle: users.updated_user.handle ?? users.user.handle,
	installed_functions: users.updated_user.installed_functions ?? users.user.installed_functions,
	last_name: users.updated_user.last_name ?? users.user.last_name,
})
